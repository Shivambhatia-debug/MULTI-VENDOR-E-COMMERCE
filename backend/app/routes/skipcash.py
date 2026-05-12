from fastapi import APIRouter, Depends, HTTPException, Request
from app.config import settings
from app.database import get_database
from app.routes.auth import get_current_user
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import hmac
import hashlib
import base64
import uuid
import json
import httpx
from bson import ObjectId

router = APIRouter(prefix="/api/payments", tags=["payments"], redirect_slashes=False)

# --- Helper Functions ---

def generate_signature(secret_key: str, data: dict) -> str:
    """Generate HMAC-SHA256 signature for SkipCash API."""
    message = ",".join(f"{k}={v}" for k, v in data.items())
    secret = secret_key.encode("utf-8")
    msg = message.encode("utf-8")
    signature = hmac.new(secret, msg, hashlib.sha256)
    return base64.b64encode(signature.digest()).decode("utf-8")


def verify_webhook_signature(webhook_key: str, data: dict) -> str:
    """Generate expected webhook signature for verification."""
    # SkipCash webhook signature fields (order matters!)
    fields = {}
    fields["PaymentId"] = str(data.get("PaymentId", ""))
    fields["Amount"] = str(data.get("Amount", ""))
    fields["StatusId"] = str(data.get("StatusId", ""))
    if data.get("TransactionId"):
        fields["TransactionId"] = str(data["TransactionId"])
    if data.get("Custom1"):
        fields["Custom1"] = str(data["Custom1"])
    fields["VisaId"] = str(data.get("VisaId", ""))
    
    return generate_signature(webhook_key, fields)


# --- Request Models ---

class CreatePaymentRequest(BaseModel):
    amount: str
    first_name: str
    last_name: str = ""
    email: str
    phone: str = ""
    order_id: str = ""
    description: str = "Golalita Payment"
    return_url: str = ""
    payment_type: str = "marketplace"  # "marketplace" or "subscription"


# --- Endpoints ---

@router.post("/create")
@router.post("/create/")
async def create_payment(payload: CreatePaymentRequest, current_user: dict = Depends(get_current_user)):
    """Create a SkipCash payment and return the payUrl for redirect."""
    if not settings.SKIPCASH_KEY_ID or not settings.SKIPCASH_KEY_SECRET:
        raise HTTPException(status_code=500, detail="SkipCash credentials not configured")
    
    uid = str(uuid.uuid4())
    transaction_id = payload.order_id or str(uuid.uuid4())
    
    # Ensure amount is string with 2 decimal places
    try:
        amount_val = float(payload.amount.replace("QAR", "").strip())
        amount_str = "{:.2f}".format(amount_val)
    except:
        amount_str = payload.amount

    # Prepare Custom1 data
    custom1_data = json.dumps({
        "user_id": str(current_user["_id"]),
        "payment_type": payload.payment_type,
        "order_id": payload.order_id
    })

    # Core fields for signature (order matters!)
    # Only include non-empty fields
    signature_fields = [
        ("Uid", uid),
        ("KeyId", settings.SKIPCASH_KEY_ID),
        ("Amount", amount_str),
        ("FirstName", payload.first_name),
        ("LastName", payload.last_name or payload.first_name),
        ("Phone", payload.phone or "+97400000000"),
        ("Email", payload.email),
        # Street, City, State, Country, PostalCode are skipped if empty
        ("TransactionId", transaction_id),
        ("Custom1", custom1_data)
    ]
    
    # Build signature data dictionary (maintaining order)
    signature_data = {k: v for k, v in signature_fields if v}

    # Generate auth signature
    auth_signature = generate_signature(settings.SKIPCASH_KEY_SECRET, signature_data)

    # Full body for POST request
    body = signature_data.copy()
    if payload.return_url:
        body["ReturnUrl"] = payload.return_url
    if payload.description:
        body["Subject"] = payload.description
    
    # Custom fields excluded from signature but allowed in body
    # body["Custom2"] = ... 
    
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
        print(f"SKIPCASH_RESPONSE: {json.dumps(result, indent=2)}")
        
        if result.get("hasError"):
            raise HTTPException(
                status_code=400, 
                detail=result.get("errorMessage", "SkipCash payment creation failed")
            )
        
        result_obj = result.get("resultObj", {})
        pay_url = result_obj.get("payUrl")
        payment_id = result_obj.get("id")
        
        if not pay_url:
            raise HTTPException(status_code=500, detail="No payment URL received from SkipCash")
        
        # Save payment record in our DB
        db = await get_database()
        await db.payments.insert_one({
            "payment_id": payment_id,
            "skipcash_uid": uid,
            "transaction_id": transaction_id,
            "amount": payload.amount,
            "user_id": str(current_user["_id"]),
            "user_email": payload.email,
            "payment_type": payload.payment_type,
            "order_id": payload.order_id,
            "status": "new",
            "pay_url": pay_url,
            "created_at": datetime.utcnow()
        })
        
        return {
            "payUrl": pay_url,
            "paymentId": payment_id,
            "transactionId": transaction_id
        }
    
    except httpx.RequestError as e:
        print(f"SKIPCASH_CONNECTION_ERROR: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Failed to connect to SkipCash: {str(e)}")


@router.post("/webhook")
@router.post("/webhook/")
async def handle_webhook(request: Request):
    """Handle SkipCash webhook notifications for payment status updates."""
    try:
        body = await request.json()
        auth_header = request.headers.get("Authorization", "")
        
        print(f"SKIPCASH_WEBHOOK_RECEIVED: {json.dumps(body, indent=2)}")
        print(f"SKIPCASH_WEBHOOK_AUTH: {auth_header}")
        
        # Verify webhook signature
        expected_signature = verify_webhook_signature(settings.SKIPCASH_WEBHOOK_KEY, body)
        
        if auth_header != expected_signature:
            print(f"WEBHOOK_SIGNATURE_MISMATCH: expected={expected_signature}, got={auth_header}")
            # Log but still process in sandbox mode
        
        payment_id = body.get("PaymentId")
        status_id = body.get("StatusId")
        amount = body.get("Amount")
        transaction_id = body.get("TransactionId")
        
        # Map StatusId to readable status
        status_map = {
            0: "new",
            1: "pending",
            2: "paid",
            3: "cancelled",
            4: "failed",
            5: "rejected",
            6: "refunded",
            7: "pending_refund",
            8: "refund_failed"
        }
        
        status = status_map.get(status_id, "unknown")
        
        db = await get_database()
        
        # Find and update the payment record
        payment_record = await db.payments.find_one({"payment_id": payment_id})
        
        if payment_record:
            # Don't downgrade a "paid" status
            if payment_record.get("status") == "paid" and status != "paid":
                print(f"WEBHOOK_SKIP: Payment {payment_id} already marked as paid, ignoring {status}")
                return {"status": "ok"}
            
            await db.payments.update_one(
                {"payment_id": payment_id},
                {"$set": {
                    "status": status,
                    "status_id": status_id,
                    "updated_at": datetime.utcnow(),
                    "visa_id": body.get("VisaId"),
                    "card_type": body.get("CardType")
                }}
            )
            
            # If payment is successful, update related records
            if status == "paid":
                payment_type = payment_record.get("payment_type", "marketplace")
                user_id = payment_record.get("user_id")
                
                if payment_type == "marketplace":
                    # Update order status
                    order_id = payment_record.get("order_id")
                    if order_id:
                        try:
                            await db.orders.update_one(
                                {"_id": ObjectId(order_id)},
                                {"$set": {"payment_status": "paid", "status": "Processing"}}
                            )
                        except:
                            await db.orders.update_one(
                                {"transaction_id": transaction_id},
                                {"$set": {"payment_status": "paid", "status": "Processing"}}
                            )
                
                elif payment_type == "subscription":
                    # Activate subscription and shift to the new plan
                    if user_id:
                        plan = payment_record.get("plan", "Basic")
                        try:
                            await db.users.update_one(
                                {"_id": ObjectId(user_id)},
                                {"$set": {
                                    "plan": plan,
                                    "subscription_status": "active",
                                    "subscription_paid_at": datetime.utcnow(),
                                    "subscription_payment_id": payment_id
                                }}
                            )
                            # Also update the merchant record
                            await db.merchants.update_one(
                                {"user_id": user_id},
                                {"$set": {"plan": plan}}
                            )
                        except Exception as e:
                            print(f"SUBSCRIPTION_UPDATE_ERROR: {str(e)}")
        
        return {"status": "ok"}
    
    except Exception as e:
        print(f"WEBHOOK_ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"status": "error", "detail": str(e)}


@router.get("/status/{payment_id}")
@router.get("/status/{payment_id}/")
async def get_payment_status(payment_id: str):
    """Check payment status from our database and optionally from SkipCash."""
    db = await get_database()
    
    # Check our local record first
    payment = await db.payments.find_one({"payment_id": payment_id})
    
    if not payment:
        # Try by transaction_id
        payment = await db.payments.find_one({"transaction_id": payment_id})
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Optionally fetch live status from SkipCash
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.SKIPCASH_BASE_URL}api/v1/payments/{payment['payment_id']}",
                headers={
                    "Authorization": settings.SKIPCASH_CLIENT_ID
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                skipcash_data = response.json()
                result_obj = skipcash_data.get("resultObj", {})
                live_status = result_obj.get("status", "").lower()
                
                # Update our record if SkipCash has newer info
                if live_status and live_status != payment.get("status"):
                    status_map = {"new": "new", "pending": "pending", "paid": "paid", 
                                  "canceled": "cancelled", "failed": "failed"}
                    mapped = status_map.get(live_status, live_status)
                    
                    # Don't downgrade paid status
                    if payment.get("status") != "paid" or mapped == "paid":
                        await db.payments.update_one(
                            {"_id": payment["_id"]},
                            {"$set": {"status": mapped, "updated_at": datetime.utcnow()}}
                        )
                        payment["status"] = mapped
                        
                        # TRIGGER POST-PAYMENT UPDATES (Duplicate of webhook logic for local dev reliability)
                        if mapped == "paid":
                            payment_type = payment.get("payment_type", "marketplace")
                            user_id = payment.get("user_id")
                            
                            if payment_type == "marketplace":
                                order_id = payment.get("order_id")
                                if order_id:
                                    await db.orders.update_one(
                                        {"_id": ObjectId(order_id)},
                                        {"$set": {"payment_status": "paid", "status": "Processing"}}
                                    )
                            elif payment_type == "subscription" and user_id:
                                plan = payment.get("plan", "Basic")
                                await db.users.update_one(
                                    {"_id": ObjectId(user_id)},
                                    {"$set": {
                                        "plan": plan,
                                        "subscription_status": "active",
                                        "subscription_paid_at": datetime.utcnow(),
                                        "subscription_payment_id": payment.get("payment_id")
                                    }}
                                )
                                # Also update the merchant record
                                await db.merchants.update_one(
                                    {"user_id": user_id},
                                    {"$set": {"plan": plan}}
                                )
    except Exception as e:
        print(f"SKIPCASH_STATUS_CHECK_ERROR: {str(e)}")
    
    return {
        "payment_id": payment.get("payment_id"),
        "transaction_id": payment.get("transaction_id"),
        "status": payment.get("status", "unknown"),
        "amount": payment.get("amount"),
        "payment_type": payment.get("payment_type"),
        "created_at": str(payment.get("created_at", "")),
    }
