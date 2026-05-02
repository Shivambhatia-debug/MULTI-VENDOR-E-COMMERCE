from fastapi import APIRouter, Depends, HTTPException
from app.database import get_database
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"], redirect_slashes=False)

@router.get("/stats")
@router.get("/stats/")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    # Check if user is admin
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    
    # 1. Total Merchants
    merchants_count = await db.users.count_documents({"role": "merchant"})
    
    # 2. Active Stores
    stores_count = await db.stores.count_documents({})
    
    # 3. Platform Revenue (Sum of all orders total)
    pipeline = [
        {"$group": {
            "_id": None,
            "total_revenue": {"$sum": {"$toDouble": {"$trim": {"input": "$total", "chars": " QAR"}}}}
        }}
    ]
    revenue_results = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_results[0]["total_revenue"] if revenue_results else 0
    
    # 4. Subscription Base (This would depend on your subscription logic, 
    # for now we'll sum up the expected monthly revenue based on plans)
    # Plans: Basic (0), Premium (499), Mobile App (999) - just as examples
    subscription_pipeline = [
        {"$match": {"role": "merchant"}},
        {"$group": {
            "_id": "$plan",
            "count": {"$sum": 1}
        }}
    ]
    sub_counts = await db.users.aggregate(subscription_pipeline).to_list(None)
    
    plan_revenue_map = {
        "Basic": 0,
        "Premium": 499,
        "Mobile App": 999
    }
    
    subscription_base = 0
    for s in sub_counts:
        plan = s["_id"] or "Basic"
        subscription_base += s["count"] * plan_revenue_map.get(plan, 0)

    return [
        {"label": "Platform Revenue", "value": f"{int(total_revenue)} QAR", "change": "+0%", "icon": "DollarSign"},
        {"label": "Total Merchants", "value": str(merchants_count), "change": "+0%", "icon": "Building"},
        {"label": "Active Stores", "value": str(stores_count), "change": "+0%", "icon": "Store"},
        {"label": "Subscription Base", "value": f"{int(subscription_base)} QAR", "change": "+0%", "icon": "CreditCard"},
    ]

@router.get("/merchants")
@router.get("/merchants/")
async def get_all_merchants(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    merchants_list = await db.users.find({"role": "merchant"}).to_list(None)
    
    # Enrich with revenue and stores count
    enriched_merchants = []
    for m in merchants_list:
        m_id = str(m["_id"])
        stores_count = await db.stores.count_documents({"merchant_id": m_id})
        
        # Revenue for this merchant
        rev_pipeline = [
            {"$match": {"merchant_id": m_id}},
            {"$group": {
                "_id": None,
                "total": {"$sum": {"$toDouble": {"$trim": {"input": "$total", "chars": " QAR"}}}}
            }}
        ]
        rev_res = await db.orders.aggregate(rev_pipeline).to_list(1)
        revenue = rev_res[0]["total"] if rev_res else 0
        
        enriched_merchants.append({
            "id": m_id,
            "name": m.get("name", "Unknown"),
            "email": m.get("email"),
            "status": m.get("status", "Active"),
            "stores": stores_count,
            "revenue": f"{int(revenue)} QAR",
            "plan": m.get("plan", "Basic"),
            "joined": m.get("created_at", "N/A")
        })
    
    return enriched_merchants

@router.get("/subscriptions")
@router.get("/subscriptions/")
async def get_subscription_distribution(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    pipeline = [
        {"$match": {"role": "merchant"}},
        {"$group": {
            "_id": "$plan",
            "count": {"$sum": 1}
        }}
    ]
    results = await db.users.aggregate(pipeline).to_list(None)
    
    plan_revenue_map = {
        "Basic": 0,
        "Premium": 499,
        "Mobile App": 999
    }
    
    plan_colors = {
        "Basic": "bg-slate-100",
        "Premium": "bg-blue-100",
        "Mobile App": "bg-indigo-100"
    }
    
    distribution = []
    for r in results:
        plan = r["_id"] or "Basic"
        count = r["count"]
        revenue = count * plan_revenue_map.get(plan, 0)
        distribution.append({
            "name": plan,
            "count": count,
            "revenue": f"{int(revenue)} QAR",
            "color": plan_colors.get(plan, "bg-slate-100")
        })
    
    # Ensure all plans are present
    existing_plans = [d["name"] for d in distribution]
    for plan in ["Basic", "Premium", "Mobile App"]:
        if plan not in existing_plans:
            distribution.append({
                "name": plan,
                "count": 0,
                "revenue": "0 QAR",
                "color": plan_colors.get(plan, "bg-slate-100")
            })
            
    return distribution

@router.get("/stores")
@router.get("/stores/")
async def get_all_stores(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    stores_list = await db.stores.find({}).to_list(None)
    
    enriched_stores = []
    for s in stores_list:
        m_id = s.get("merchant_id")
        merchant = await db.users.find_one({"_id": m_id}) if m_id else None
        
        enriched_stores.append({
            "id": str(s["_id"]),
            "name": s.get("name", "Unnamed Store"),
            "subdomain": s.get("subdomain", "n/a"),
            "merchant_name": merchant.get("name") if merchant else "Unknown",
            "merchant_email": merchant.get("email") if merchant else "N/A",
            "status": s.get("status", "Active"),
            "created_at": s.get("created_at", "N/A")
        })
        
    return enriched_stores
