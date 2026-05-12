from fastapi import APIRouter, Depends, HTTPException, Request
from app.database import get_database
from app.models.user import UserOut
from bson import ObjectId
from typing import List, Optional

router = APIRouter()

@router.get("/lookup-store/{identifier}")
async def lookup_store(identifier: str, db = Depends(get_database)):
    # 1. Try looking up in store_configs first (Custom Domain or Subdomain)
    config = await db.store_configs.find_one({
        "$or": [
            {"custom_domain": identifier},
            {"subdomain": identifier.split('.')[0]} # Handle 'timestop' or 'timestop.golalita.qa'
        ]
    })
    
    user = None
    if config:
        merchant_id = config.get("merchant_id")
        try:
            user = await db.users.find_one({"_id": ObjectId(merchant_id)})
        except:
            user = await db.users.find_one({"_id": merchant_id})
    
    # 2. Backup: Try looking up by store_slug or custom_domain in users collection
    if not user:
        user = await db.users.find_one({
            "$or": [
                {"store_slug": identifier},
                {"custom_domain": identifier}
            ]
        })
    
    # 3. Last Resort: Try by merchantId directly if it's a valid ObjectId
    if not user:
        try:
            if ObjectId.is_valid(identifier):
                user = await db.users.find_one({"_id": ObjectId(identifier)})
        except:
            pass
            
    if not user:
        raise HTTPException(status_code=404, detail="Store not found")
        
    # Get merchant record
    merchant = await db.merchants.find_one({"user_id": str(user["_id"])})
    
    # Get products
    products = await db.products.find({"merchant_id": str(user["_id"])}).to_list(None)
    for p in products:
        p["_id"] = str(p["_id"])
        
    # Get config (if any)
    config = await db.store_configs.find_one({"merchant_id": str(user["_id"])})
    if config:
        config["_id"] = str(config["_id"])
    else:
        config = {
            "store_name": user.get("name", "Store"),
            "primary_color": "#2563eb",
            "bg_color": "#ffffff",
            "text_color": "#0f172a"
        }
        
    return {
        "merchant": {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "plan": user.get("plan")
        },
        "config": config,
        "products": products
    }
