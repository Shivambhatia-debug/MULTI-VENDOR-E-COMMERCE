from fastapi import APIRouter, Depends, HTTPException
from app.database import get_database
from app.routes.auth import get_current_user
from app.config import settings
from datetime import datetime, timedelta
from bson import ObjectId
import uuid
import json

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"], redirect_slashes=False)

# PLAN_PRICES will now be fetched from DB
async def get_plan_prices():
    db = await get_database()
    plans = await db.plans.find({"is_active": True}).to_list(None)
    return {p["name"]: p["price"] for p in plans}

@router.get("/plans")
@router.get("/plans/")
async def list_active_plans():
    """List all active subscription plans for the pricing page."""
    db = await get_database()
    plans = await db.plans.find({"is_active": True}).to_list(None)
    for p in plans:
        p["id"] = str(p["_id"])
        p.pop("_id", None)
    return plans

@router.get("/status")
@router.get("/status/")
async def get_subscription_status(current_user: dict = Depends(get_current_user)):
    """Get current subscription/trial status for the logged-in merchant."""
    user_id = str(current_user["_id"])
    
    trial_start = current_user.get("trial_start")
    trial_end = current_user.get("trial_end")
    subscription_status = current_user.get("subscription_status", "none")
    plan = current_user.get("plan", "Basic")
    
    trial_remaining_days = 0
    is_trial_active = False
    
    if trial_end:
        if isinstance(trial_end, str):
            trial_end = datetime.fromisoformat(trial_end)
        now = datetime.utcnow()
        if now < trial_end:
            is_trial_active = True
            trial_remaining_days = (trial_end - now).days
    
    return {
        "user_id": user_id,
        "plan": plan,
        "subscription_status": subscription_status,
        "is_trial_active": is_trial_active,
        "trial_remaining_days": trial_remaining_days,
        "trial_start": str(trial_start) if trial_start else None,
        "trial_end": str(trial_end) if trial_end else None,
        "paid_at": str(current_user.get("subscription_paid_at")) if current_user.get("subscription_paid_at") else None
    }


@router.post("/start-trial")
@router.post("/start-trial/")
async def start_free_trial(current_user: dict = Depends(get_current_user)):
    """Start a 15-day free trial for a merchant if they don't have one yet."""
    if current_user.get("role") != "merchant":
        raise HTTPException(status_code=403, detail="Only merchants can start a trial")
    
    if current_user.get("subscription_status") in ["trial", "active"]:
        return {"message": "Subscription or trial already active", "status": current_user.get("subscription_status")}
    
    db = await get_database()
    trial_start = datetime.utcnow()
    trial_end = trial_start + timedelta(days=15)
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {
            "trial_start": trial_start,
            "trial_end": trial_end,
            "subscription_status": "trial",
            "plan": "Basic"
        }}
    )
    
    return {
        "message": "Trial started successfully",
        "trial_end": str(trial_end),
        "plan": "Basic"
    }


@router.post("/upgrade")
@router.post("/upgrade/")
async def upgrade_plan(data: dict, current_user: dict = Depends(get_current_user)):
    """Initiate plan upgrade via SkipCash payment."""
    plan = data.get("plan", "Basic")
    return_url = data.get("return_url", "")
    
    plan_prices = await get_plan_prices()
    if plan not in plan_prices:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {plan}. Choose from: {list(plan_prices.keys())}")
    
    amount = plan_prices[plan]
    user_id = str(current_user["_id"])
    
    # Create a subscription payment via the SkipCash route
    from app.routes.skipcash import generate_signature
    import httpx
    
    uid = str(uuid.uuid4())
    transaction_id = f"SUB-{user_id[:8]}-{uuid.uuid4().hex[:8]}"
    
    # Prepare Custom1 data
    custom1_data = json.dumps({
        "user_id": user_id,
        "payment_type": "subscription",
        "plan": plan
    })

    # Core fields for signature (order matters!)
    signature_fields = [
        ("Uid", uid),
        ("KeyId", settings.SKIPCASH_KEY_ID),
        ("Amount", f"{amount}.00"),
        ("FirstName", current_user.get("name", "Merchant")),
        ("LastName", "Subscription"),
        ("Phone", current_user.get("phone", "+97400000000")),
        ("Email", current_user.get("email", "merchant@golalita.com")),
        ("TransactionId", transaction_id),
        ("Custom1", custom1_data)
    ]
    
    signature_data = {k: v for k, v in signature_fields if v}
    
    auth_signature = generate_signature(settings.SKIPCASH_KEY_SECRET, signature_data)
    
    # Full body for POST request
    body = signature_data.copy()
    body["Subject"] = f"Golalita {plan} Plan Subscription"
    if return_url:
        body["ReturnUrl"] = return_url
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.SKIPCASH_BASE_URL}api/v1/payments",
                json=body,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": auth_signature
                },
                timeout=30.0
            )
        
        result = response.json()
        
        if result.get("hasError"):
            raise HTTPException(status_code=400, detail=result.get("errorMessage", "Payment creation failed"))
        
        result_obj = result.get("resultObj", {})
        pay_url = result_obj.get("payUrl")
        payment_id = result_obj.get("id")
        
        if not pay_url:
            raise HTTPException(status_code=500, detail="No payment URL received")
        
        # Save payment record
        db = await get_database()
        await db.payments.insert_one({
            "payment_id": payment_id,
            "skipcash_uid": uid,
            "transaction_id": transaction_id,
            "amount": f"{amount}.00",
            "user_id": user_id,
            "user_email": current_user.get("email"),
            "payment_type": "subscription",
            "plan": plan,
            "status": "new",
            "pay_url": pay_url,
            "created_at": datetime.utcnow()
        })
        
        # Update user's pending plan
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"pending_plan": plan}}
        )
        
        return {
            "payUrl": pay_url,
            "paymentId": payment_id,
            "amount": amount,
            "plan": plan
        }
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Failed to connect to payment gateway: {str(e)}")
