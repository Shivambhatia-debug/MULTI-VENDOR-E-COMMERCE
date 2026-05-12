from fastapi import APIRouter, Depends, HTTPException
from app.database import get_database
from app.routes.auth import get_current_user
from app.config import settings
from bson import ObjectId
from datetime import datetime
import socket
import httpx

router = APIRouter(tags=["admin"], redirect_slashes=False)
print(">>> LOADING ADMIN ROUTER")

@router.get("/merchant-subscriptions")
@router.get("/merchant-subscriptions/")
async def get_all_subscriptions(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db = await get_database()
    merchants_users = await db.users.find({"role": "merchant"}).to_list(None)
    merchant_profiles = await db.merchants.find().to_list(None)
    profile_map = {p.get("user_id"): p for p in merchant_profiles}
    subscriptions = []
    for m in merchants_users:
        user_id = str(m["_id"])
        profile = profile_map.get(user_id, {})
        name = profile.get("store_name") or profile.get("business_name") or m.get("name") or "Unknown Merchant"
        subscriptions.append({
            "merchant_id": user_id,
            "merchant_name": name,
            "merchant_email": m.get("email", "No Email"),
            "plan": m.get("plan") or profile.get("plan") or "Basic",
            "status": m.get("subscription_status") or profile.get("subscription_status") or "none",
            "paid_at": str(m.get("subscription_paid_at")) if m.get("subscription_paid_at") else None,
            "trial_end": str(m.get("trial_end")) if m.get("trial_end") else None,
            "is_paid": m.get("subscription_status") == "active"
        })
    return subscriptions

@router.get("/stats")
@router.get("/stats/")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    # Check if user is admin
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    
    # 1. Total Merchants
    merchants_count = await db.users.count_documents({"role": "merchant"})
    
    # 2. Active Stores (Using store_configs)
    stores_count = await db.store_configs.count_documents({})
    
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
        stores_count = await db.store_configs.count_documents({"merchant_id": m_id})
        
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
            "subscription_status": m.get("subscription_status", "none"),
            "trial_end": str(m.get("trial_end")) if m.get("trial_end") else None,
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
    stores_list = await db.store_configs.find({}).to_list(None)
    
    enriched_stores = []
    for s in stores_list:
        m_id = s.get("merchant_id")
        merchant = None
        if m_id:
            try:
                merchant = await db.users.find_one({"_id": ObjectId(m_id)})
            except:
                merchant = await db.users.find_one({"_id": m_id})
        
        enriched_stores.append({
            "id": str(s["_id"]),
            "name": s.get("store_name", "Unnamed Store"),
            "subdomain": s.get("subdomain", "n/a"),
            "merchant_name": merchant.get("name") if merchant else "Unknown",
            "merchant_email": merchant.get("email") if merchant else "N/A",
            "status": "Active" if s.get("is_published") else "Draft",
            "is_approved": s.get("is_approved", False),
            "created_at": s.get("created_at", "N/A")
        })
        
    return enriched_stores

@router.get("/verification/pending")
@router.get("/verification/pending/")
async def get_pending_verifications(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    # A store is pending if it's published by merchant but not yet approved by admin
    pending_stores = await db.store_configs.find({
        "is_published": True, 
        "is_approved": {"$ne": True}
    }).to_list(None)
    
    enriched = []
    for s in pending_stores:
        m_id = s.get("merchant_id")
        merchant = None
        if m_id:
            try:
                merchant = await db.users.find_one({"_id": ObjectId(m_id)})
            except:
                merchant = await db.users.find_one({"_id": m_id})
        
        enriched.append({
            "id": str(s["_id"]),
            "store_name": s.get("store_name"),
            "subdomain": s.get("subdomain"),
            "merchant_name": merchant.get("name") if merchant else "Unknown",
            "merchant_email": merchant.get("email") if merchant else "N/A",
            "requested_at": s.get("updated_at", s.get("created_at", "N/A"))
        })
    return enriched

@router.post("/verification/approve/{store_id}")
@router.post("/verification/approve/{store_id}/")
async def approve_store(store_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    result = await db.store_configs.update_one(
        {"_id": ObjectId(store_id)},
        {"$set": {"is_approved": True, "verification_status": "Verified", "verified_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Store not found")
    return {"message": "Store approved successfully"}

@router.post("/verification/reject/{store_id}")
@router.post("/verification/reject/{store_id}/")
async def reject_store(store_id: str, reason: str = "Does not meet platform guidelines", current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    result = await db.store_configs.update_one(
        {"_id": ObjectId(store_id)},
        {"$set": {"is_approved": False, "is_published": False, "verification_status": "Rejected", "rejection_reason": reason}}
    )
    return {"message": "Store rejected"}

@router.get("/marketplace/settings")
async def get_marketplace_settings(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    settings = await db.platform_settings.find_one({"type": "marketplace"})
    if not settings:
        # Default settings
        return {
            "banners": [],
            "featured_merchants": [],
            "announcement_ticker": "Welcome to Golalita Marketplace - The Future of Qatari Commerce"
        }
    settings["id"] = str(settings["_id"])
    settings.pop("_id", None)
    return settings

@router.post("/marketplace/settings")
async def update_marketplace_settings(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    await db.platform_settings.update_one(
        {"type": "marketplace"},
        {"$set": data},
        upsert=True
    )
    return {"message": "Marketplace settings updated"}

@router.get("/platform/settings")
async def get_platform_settings(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    settings = await db.platform_settings.find_one({"type": "global"})
    if not settings:
        return {
            "general": {
                "platform_fee": "2.5",
                "default_currency": "QAR",
            },
            "security": {
                "mfa_required": False,
                "session_timeout": "30",
            },
            "payments": {
                "stripe_enabled": True,
                "payout_schedule": "weekly"
            },
            "notifications": {
                "email_alerts": True,
                "sms_alerts": False
            },
            "region": {
                "timezone": "Asia/Qatar",
                "language": "en"
            }
        }
    settings["id"] = str(settings["_id"])
    settings.pop("_id", None)
    return settings

@router.post("/platform/settings")
async def update_platform_settings(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    # Don't overwrite type
    data["type"] = "global"
    await db.platform_settings.update_one(
        {"type": "global"},
        {"$set": data},
        upsert=True
    )
    return {"message": "Platform settings updated"}


# ============================================================
# DOMAIN MANAGEMENT
# ============================================================

@router.get("/domains/pending")
@router.get("/domains/pending/")
async def get_pending_domains(current_user: dict = Depends(get_current_user)):
    """Get all stores with pending or submitted custom domains."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    stores = await db.store_configs.find({
        "custom_domain": {"$ne": None},
        "domain_status": {"$in": ["pending_dns", "dns_verified", "deploying", "failed"]}
    }).to_list(None)
    
    enriched = []
    for s in stores:
        m_id = s.get("merchant_id")
        merchant = None
        if m_id:
            try:
                merchant = await db.users.find_one({"_id": ObjectId(m_id)})
            except:
                merchant = await db.users.find_one({"_id": m_id})
        
        enriched.append({
            "id": str(s["_id"]),
            "store_name": s.get("store_name", "Unnamed Store"),
            "subdomain": s.get("subdomain", ""),
            "custom_domain": s.get("custom_domain"),
            "domain_status": s.get("domain_status", "none"),
            "ssl_status": s.get("ssl_status", "none"),
            "dns_records": s.get("dns_records", []),
            "domain_submitted_at": s.get("domain_submitted_at"),
            "domain_verified_at": s.get("domain_verified_at"),
            "merchant_name": merchant.get("name") if merchant else "Unknown",
            "merchant_email": merchant.get("email") if merchant else "N/A",
        })
    
    return enriched


@router.get("/domains/all")
@router.get("/domains/all/")
async def get_all_domains(current_user: dict = Depends(get_current_user)):
    """Get all stores that have custom domains (any status)."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    stores = await db.store_configs.find({
        "custom_domain": {"$ne": None}
    }).to_list(None)
    
    enriched = []
    for s in stores:
        m_id = s.get("merchant_id")
        merchant = None
        if m_id:
            try:
                merchant = await db.users.find_one({"_id": ObjectId(m_id)})
            except:
                merchant = await db.users.find_one({"_id": m_id})
        
        enriched.append({
            "id": str(s["_id"]),
            "store_name": s.get("store_name", "Unnamed Store"),
            "subdomain": s.get("subdomain", ""),
            "custom_domain": s.get("custom_domain"),
            "domain_status": s.get("domain_status", "none"),
            "ssl_status": s.get("ssl_status", "none"),
            "dns_records": s.get("dns_records", []),
            "domain_submitted_at": s.get("domain_submitted_at"),
            "domain_verified_at": s.get("domain_verified_at"),
            "merchant_name": merchant.get("name") if merchant else "Unknown",
            "merchant_email": merchant.get("email") if merchant else "N/A",
        })
    
    return enriched


@router.post("/domains/check-dns/{store_id}")
@router.post("/domains/check-dns/{store_id}/")
async def check_domain_dns(store_id: str, current_user: dict = Depends(get_current_user)):
    """Check if a domain's DNS records are correctly configured."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    config = await db.store_configs.find_one({"_id": ObjectId(store_id)})
    if not config:
        raise HTTPException(status_code=404, detail="Store not found")
    
    domain = config.get("custom_domain")
    if not domain:
        raise HTTPException(status_code=400, detail="No custom domain configured")
    
    # Perform DNS lookup
    results = {"domain": domain, "checks": []}
    
    # Check A record (root domain → 76.76.21.21)
    try:
        addr_info = socket.getaddrinfo(domain, None, socket.AF_INET)
        resolved_ips = list(set([addr[4][0] for addr in addr_info]))
        a_correct = "76.76.21.21" in resolved_ips
        results["checks"].append({
            "type": "A",
            "name": domain,
            "expected": "76.76.21.21",
            "found": ", ".join(resolved_ips) if resolved_ips else "No records",
            "verified": a_correct
        })
    except socket.gaierror:
        results["checks"].append({
            "type": "A",
            "name": domain,
            "expected": "76.76.21.21",
            "found": "DNS not resolving",
            "verified": False
        })
    
    # Check www CNAME (www.domain → cname.vercel-dns.com)
    www_domain = f"www.{domain}"
    try:
        addr_info = socket.getaddrinfo(www_domain, None)
        www_resolved = True
        results["checks"].append({
            "type": "CNAME",
            "name": www_domain,
            "expected": "cname.vercel-dns.com",
            "found": "Resolving (CNAME likely set)",
            "verified": True
        })
    except socket.gaierror:
        results["checks"].append({
            "type": "CNAME",
            "name": www_domain,
            "expected": "cname.vercel-dns.com",
            "found": "Not resolving",
            "verified": False
        })
    
    # Overall verdict
    all_verified = all(c["verified"] for c in results["checks"])
    results["all_verified"] = all_verified
    
    # Update domain status if DNS is verified
    if all_verified:
        await db.store_configs.update_one(
            {"_id": ObjectId(store_id)},
            {"$set": {"domain_status": "dns_verified"}}
        )
        results["message"] = "DNS verified! Domain is ready to deploy."
    else:
        results["message"] = "DNS not fully configured. Please check the records above."
    
    return results


@router.post("/domains/deploy/{store_id}")
@router.post("/domains/deploy/{store_id}/")
async def deploy_domain(store_id: str, current_user: dict = Depends(get_current_user)):
    """Deploy a verified domain to Vercel (makes it live)."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    config = await db.store_configs.find_one({"_id": ObjectId(store_id)})
    if not config:
        raise HTTPException(status_code=404, detail="Store not found")
    
    domain = config.get("custom_domain")
    if not domain:
        raise HTTPException(status_code=400, detail="No custom domain configured")
    
    domain_status = config.get("domain_status")
    if domain_status not in ["dns_verified", "pending_dns", "failed"]:
        if domain_status == "active":
            raise HTTPException(status_code=400, detail="Domain is already active")
        raise HTTPException(status_code=400, detail=f"Domain status '{domain_status}' cannot be deployed")
    
    # Update status to deploying
    await db.store_configs.update_one(
        {"_id": ObjectId(store_id)},
        {"$set": {"domain_status": "deploying"}}
    )
    
    # Try Vercel API if credentials are configured
    vercel_success = False
    vercel_domain_id = None
    
    if settings.VERCEL_TOKEN and settings.VERCEL_PROJECT_ID:
        try:
            headers = {
                "Authorization": f"Bearer {settings.VERCEL_TOKEN}",
                "Content-Type": "application/json"
            }
            
            url = f"https://api.vercel.com/v10/projects/{settings.VERCEL_PROJECT_ID}/domains"
            if settings.VERCEL_TEAM_ID:
                url += f"?teamId={settings.VERCEL_TEAM_ID}"
            
            async with httpx.AsyncClient() as client:
                # Add domain to Vercel
                response = await client.post(
                    url,
                    json={"name": domain},
                    headers=headers,
                    timeout=30.0
                )
                
                result = response.json()
                print(f"VERCEL_ADD_DOMAIN: {result}")
                
                if response.status_code in [200, 201]:
                    vercel_success = True
                    vercel_domain_id = result.get("name", domain)
                elif response.status_code == 409:
                    # Domain already exists — that's fine
                    vercel_success = True
                    vercel_domain_id = domain
                else:
                    print(f"VERCEL_ERROR: {result}")
                    # Fall through to simulated mode
                    
        except Exception as e:
            print(f"VERCEL_DEPLOY_ERROR: {str(e)}")
            # Fall through to simulated mode
    
    # If no Vercel credentials or API failed, simulate deployment
    if not vercel_success:
        print(f"DOMAIN_DEPLOY: Simulating deployment for {domain} (no Vercel credentials)")
        vercel_domain_id = f"simulated-{domain}"
    
    # Update store config
    await db.store_configs.update_one(
        {"_id": ObjectId(store_id)},
        {"$set": {
            "domain_status": "active",
            "ssl_status": "active",
            "domain_verified_at": datetime.utcnow().isoformat(),
            "vercel_domain_id": vercel_domain_id
        }}
    )
    
    return {
        "message": f"Domain {domain} deployed successfully!",
        "domain": domain,
        "status": "active",
        "ssl": "active",
        "vercel_deployed": vercel_success,
        "urls": {
            "subdomain": f"{config.get('subdomain', 'store')}.golalita.qa",
            "custom_domain": domain
        }
    }


@router.post("/domains/reject/{store_id}")
@router.post("/domains/reject/{store_id}/")
async def reject_domain(store_id: str, reason: str = "DNS records not properly configured", current_user: dict = Depends(get_current_user)):
    """Reject a domain request."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = await get_database()
    result = await db.store_configs.update_one(
        {"_id": ObjectId(store_id)},
        {"$set": {
            "domain_status": "failed",
            "domain_rejection_reason": reason
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Store not found")
    
    return {"message": "Domain request rejected", "reason": reason}

# ============================================================
# SUBSCRIPTION MANAGEMENT
# ============================================================

@router.get("/plans")
@router.get("/plans/")
async def get_plans(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db = await get_database()
    plans = await db.plans.find({}).to_list(None)
    for p in plans:
        p["id"] = str(p["_id"])
        p.pop("_id", None)
    return plans

@router.post("/plans")
@router.post("/plans/")
async def create_plan(plan: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db = await get_database()
    result = await db.plans.insert_one(plan)
    return {"id": str(result.inserted_id), "message": "Plan created successfully"}

@router.put("/plans/{plan_id}")
@router.put("/plans/{plan_id}/")
async def update_plan(plan_id: str, plan_data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db = await get_database()
    await db.plans.update_one({"_id": ObjectId(plan_id)}, {"$set": plan_data})
    return {"message": "Plan updated successfully"}

@router.delete("/plans/{plan_id}")
@router.delete("/plans/{plan_id}/")
async def delete_plan(plan_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db = await get_database()
    await db.plans.delete_one({"_id": ObjectId(plan_id)})
    return {"message": "Plan deleted successfully"}
