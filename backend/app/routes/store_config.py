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
    update_data = config_in.dict(exclude_unset=True)
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
        {"$set": {"is_published": True, "is_approved": False, "updated_at": datetime.utcnow().isoformat()}},
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

    subdomain = config.get("subdomain", "store")
    custom_domain = config.get("custom_domain")
    domain_status = config.get("domain_status", "none")
    ssl_status = config.get("ssl_status", "none")

    return {
        "subdomain": subdomain,
        "subdomain_url": f"{subdomain}.golalita.qa",
        "custom_domain": custom_domain,
        "domain_status": domain_status,
        "ssl_status": ssl_status,
        "dns_records": config.get("dns_records", []),
        "domain_submitted_at": config.get("domain_submitted_at"),
        "domain_verified_at": config.get("domain_verified_at"),
        "domain_rejection_reason": config.get("domain_rejection_reason"),
    }


def validate_domain(domain: str) -> str:
    """Clean and validate a domain name."""
    # Strip protocol and paths
    domain = domain.strip().lower()
    domain = re.sub(r'^https?://', '', domain)
    domain = domain.split('/')[0]  # Remove paths
    domain = domain.split('?')[0]  # Remove query strings
    
    # Validate format
    domain_regex = r'^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$'
    if not re.match(domain_regex, domain):
        raise HTTPException(status_code=400, detail=f"Invalid domain format: {domain}")
    
    # Block our own subdomain domains
    if domain.endswith('.golalita.qa') or domain.endswith('.golalita.com'):
        raise HTTPException(status_code=400, detail="Cannot use a Golalita subdomain as custom domain")
    
    return domain


def generate_dns_records(domain: str, store_id: str) -> list:
    """Generate the DNS records a merchant needs to configure."""
    records = []
    
    # A record for root domain
    records.append({
        "type": "A",
        "name": "@",
        "value": "76.76.21.21",
        "purpose": "Points your domain to Vercel servers"
    })
    
    # CNAME for www subdomain
    records.append({
        "type": "CNAME",
        "name": "www",
        "value": "cname.vercel-dns.com",
        "purpose": "Points www.{} to Vercel".format(domain)
    })
    
    return records


@router.put("/domain")
@router.put("/domain/")
async def update_domain(domain_in: DomainUpdate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])

    config = await db.store_configs.find_one({"merchant_id": merchant_id})
    if not config:
        raise HTTPException(status_code=404, detail="Store config not found")

    update_data = {}
    update_data["updated_at"] = datetime.utcnow().isoformat()

    # Handle subdomain update
    if domain_in.subdomain is not None:
        update_data["subdomain"] = slugify(domain_in.subdomain)

    # Handle custom domain submission
    if domain_in.custom_domain is not None:
        if domain_in.custom_domain == "":
            # Removing custom domain
            update_data["custom_domain"] = None
            update_data["domain_status"] = "none"
            update_data["ssl_status"] = "none"
            update_data["dns_records"] = []
            update_data["domain_submitted_at"] = None
            update_data["domain_verified_at"] = None
            update_data["domain_rejection_reason"] = None
            update_data["vercel_domain_id"] = None
        else:
            # Submitting a new custom domain
            clean_domain = validate_domain(domain_in.custom_domain)
            
            # Check if domain is already used by another store
            existing = await db.store_configs.find_one({
                "custom_domain": clean_domain,
                "merchant_id": {"$ne": merchant_id}
            })
            if existing:
                raise HTTPException(status_code=409, detail="This domain is already connected to another store")
            
            store_id = str(config["_id"])
            dns_records = generate_dns_records(clean_domain, store_id)
            
            update_data["custom_domain"] = clean_domain
            update_data["domain_status"] = "pending_dns"
            update_data["ssl_status"] = "none"
            update_data["dns_records"] = dns_records
            update_data["domain_submitted_at"] = datetime.utcnow().isoformat()
            update_data["domain_verified_at"] = None
            update_data["domain_rejection_reason"] = None
            update_data["vercel_domain_id"] = None

            # Automatic Subdomain Update:
            # If the current subdomain is "store" or generic, update it to match the custom domain name
            # e.g., watches.com -> subdomain "watches"
            current_subdomain = config.get("subdomain", "")
            if not current_subdomain or current_subdomain == "store" or current_subdomain.startswith("store-"):
                new_subdomain = clean_domain.split('.')[0]
                # Check if this new subdomain is available
                sub_existing = await db.store_configs.find_one({
                    "subdomain": new_subdomain,
                    "merchant_id": {"$ne": merchant_id}
                })
                if not sub_existing:
                    update_data["subdomain"] = new_subdomain

    result = await db.store_configs.find_one_and_update(
        {"merchant_id": merchant_id},
        {"$set": update_data},
        return_document=True
    )

    if not result:
        raise HTTPException(status_code=404, detail="Store config not found")

    result["id"] = str(result["_id"])
    result.pop("_id", None)
    
    # Add subdomain_url to response
    sub = result.get("subdomain", "store")
    result["subdomain_url"] = f"{sub}.golalita.qa"
    
    return result

