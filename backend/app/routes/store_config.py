from fastapi import APIRouter, Depends, HTTPException
from app.database import get_database
from app.models.store_config import StoreConfigBase, StoreConfigUpdate, DomainUpdate
from app.routes.auth import get_current_user
from bson import ObjectId
from datetime import datetime
import re

router = APIRouter(tags=["store-config"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text


@router.get("")
@router.get("/")
async def get_store_config(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])

    config = await db.store_configs.find_one({"merchant_id": merchant_id})

    if not config:
        # Auto-create default config
        merchant = await db.merchants.find_one({"user_id": merchant_id})
        store_name = current_user.get("name", "My Store")
        subdomain = slugify(store_name)

        default = StoreConfigBase(
            store_name=store_name,
            subdomain=subdomain,
        ).dict()
        default["merchant_id"] = merchant_id
        default["updated_at"] = datetime.utcnow().isoformat()

        result = await db.store_configs.insert_one(default)
        default["id"] = str(result.inserted_id)
        default.pop("_id", None)

        # Attach merchant info
        if merchant:
            default["merchant_name"] = merchant.get("name", store_name)
            default["merchant_category"] = merchant.get("category", "Retail")
            default["merchant_rating"] = merchant.get("rating", 0.0)
            default["merchant_reviews"] = merchant.get("reviews", 0)
            default["cover_image"] = merchant.get("coverImage")

        return default

    config["id"] = str(config["_id"])
    config.pop("_id", None)

    # Attach merchant info
    merchant = await db.merchants.find_one({"user_id": merchant_id})
    if merchant:
        config["merchant_name"] = merchant.get("name", "")
        config["merchant_category"] = merchant.get("category", "Retail")
        config["merchant_rating"] = merchant.get("rating", 0.0)
        config["merchant_reviews"] = merchant.get("reviews", 0)
        config["cover_image"] = merchant.get("coverImage")

    return config


@router.put("/save")
@router.put("/save/")
async def update_store_config(config_in: StoreConfigUpdate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])

    print(f"DEBUG: Updating store config for merchant {merchant_id}")
    update_data = config_in.dict()
    update_data["updated_at"] = datetime.utcnow().isoformat()

    try:
        result = await db.store_configs.find_one_and_update(
            {"merchant_id": merchant_id},
            {"$set": update_data},
            upsert=True,
            return_document=True
        )
        print("DEBUG: Store config updated successfully")
    except Exception as e:
        print(f"DEBUG: Error updating store config: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    result["id"] = str(result["_id"])
    result.pop("_id", None)
    return result


@router.post("/publish")
@router.post("/publish/")
async def publish_store(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])

    result = await db.store_configs.find_one_and_update(
        {"merchant_id": merchant_id},
        {"$set": {"is_published": True, "updated_at": datetime.utcnow().isoformat()}},
        return_document=True
    )

    if not result:
        raise HTTPException(status_code=404, detail="Store config not found. Save settings first.")

    result["id"] = str(result["_id"])
    result.pop("_id", None)
    return {"status": "published", "config": result}


@router.get("/domain")
@router.get("/domain/")
async def get_domain_info(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])

    config = await db.store_configs.find_one({"merchant_id": merchant_id})
    if not config:
        raise HTTPException(status_code=404, detail="Store config not found")

    return {
        "subdomain": config.get("subdomain", ""),
        "custom_domain": config.get("custom_domain"),
        "ssl_status": config.get("ssl_status", "none"),
        "full_url": f"{config.get('subdomain', 'store')}.golalita.qa"
    }


@router.put("/domain")
@router.put("/domain/")
async def update_domain(domain_in: DomainUpdate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])

    update_data = {}
    if domain_in.custom_domain is not None:
        update_data["custom_domain"] = domain_in.custom_domain
        # Simulate SSL provisioning
        update_data["ssl_status"] = "provisioning" if domain_in.custom_domain else "none"
    if domain_in.subdomain is not None:
        update_data["subdomain"] = slugify(domain_in.subdomain)

    update_data["updated_at"] = datetime.utcnow().isoformat()

    result = await db.store_configs.find_one_and_update(
        {"merchant_id": merchant_id},
        {"$set": update_data},
        return_document=True
    )

    if not result:
        raise HTTPException(status_code=404, detail="Store config not found")

    # Simulate SSL activation after a "delay" (instant in dev)
    if result.get("ssl_status") == "provisioning" and result.get("custom_domain"):
        await db.store_configs.update_one(
            {"merchant_id": merchant_id},
            {"$set": {"ssl_status": "active"}}
        )
        result["ssl_status"] = "active"

    result["id"] = str(result["_id"])
    result.pop("_id", None)
    return result
