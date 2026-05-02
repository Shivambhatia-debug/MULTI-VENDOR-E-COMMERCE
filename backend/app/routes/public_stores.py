from fastapi import APIRouter
from ..database import get_database
from bson import ObjectId

router = APIRouter(prefix="/api/public", tags=["public-stores"])


@router.get("/stores")
@router.get("/stores/")
async def list_published_stores():
    db = await get_database()

    configs = await db.store_configs.find({"is_published": True}).to_list(None)
    stores = []

    for config in configs:
        merchant_id = config.get("merchant_id")

        # Get merchant profile
        merchant = await db.merchants.find_one({"user_id": merchant_id})

        # Count products
        products_count = await db.products.count_documents({"merchant_id": merchant_id})

        store = {
            "id": str(config["_id"]),
            "merchant_id": merchant_id,
            "store_name": config.get("store_name", "Store"),
            "subdomain": config.get("subdomain", ""),
            "primary_color": config.get("primary_color", "#2563eb"),
            "logo_url": config.get("logo_url", ""),
            "hero_image": config.get("hero_image", ""),
            "hero_layout": config.get("hero_layout", "split"),
            "banner_title": config.get("banner_title", ""),
            "banner_subtitle": config.get("banner_subtitle", ""),
            "products_count": products_count,
            "category": "Retail",
            "rating": 0.0,
            "reviews": 0,
            "cover_image": config.get("hero_image", ""),
        }

        if merchant:
            store["category"] = merchant.get("category", "Retail")
            store["rating"] = merchant.get("rating", 0.0)
            store["reviews"] = merchant.get("reviews", 0)
            store["cover_image"] = merchant.get("coverImage") or config.get("hero_image", "")

        stores.append(store)

    return stores


@router.get("/stores/by-subdomain/{subdomain}")
@router.get("/stores/by-subdomain/{subdomain}/")
async def get_store_by_subdomain(subdomain: str):
    """Resolve a store by its subdomain slug (e.g., 'lux-apparel')"""
    db = await get_database()

    config = await db.store_configs.find_one({"subdomain": subdomain, "is_published": True})
    if not config:
        return {"error": "Store not found or not published"}

    return await _build_store_detail(db, config)


@router.get("/stores/{store_id}")
@router.get("/stores/{store_id}/")
async def get_public_store(store_id: str):
    db = await get_database()

    # Try ObjectId first
    config = None
    try:
        config = await db.store_configs.find_one({"_id": ObjectId(store_id), "is_published": True})
    except Exception:
        pass

    # Fallback: try as subdomain
    if not config:
        config = await db.store_configs.find_one({"subdomain": store_id, "is_published": True})

    if not config:
        return {"error": "Store not found or not published"}

    return await _build_store_detail(db, config)


async def _build_store_detail(db, config):
    """Shared helper to build a full store detail response."""
    merchant_id = config.get("merchant_id")

    # Get products
    products = []
    cursor = db.products.find({"merchant_id": merchant_id})
    async for product in cursor:
        product["id"] = str(product["_id"])
        product.pop("_id", None)
        products.append(product)

    # Get merchant
    merchant = await db.merchants.find_one({"user_id": merchant_id})

    store = {
        "id": str(config["_id"]),
        "subdomain": config.get("subdomain", ""),
        "config": {
            "store_name": config.get("store_name"),
            "primary_color": config.get("primary_color"),
            "bg_color": config.get("bg_color"),
            "text_color": config.get("text_color"),
            "accent_color": config.get("accent_color"),
            "banner_title": config.get("banner_title"),
            "banner_subtitle": config.get("banner_subtitle"),
            "banner_btn": config.get("banner_btn"),
            "hero_image": config.get("hero_image"),
            "hero_layout": config.get("hero_layout"),
            "logo_url": config.get("logo_url"),
            "ticker_text": config.get("ticker_text"),
            "ticker_color": config.get("ticker_color"),
            "show_ticker": config.get("show_ticker"),
            "discovery_title": config.get("discovery_title"),
            "discovery_subtitle": config.get("discovery_subtitle"),
        },
        "products": products,
        "merchant": {
            "name": merchant.get("name", "") if merchant else config.get("store_name"),
            "category": merchant.get("category", "Retail") if merchant else "Retail",
            "rating": merchant.get("rating", 0.0) if merchant else 0.0,
            "reviews": merchant.get("reviews", 0) if merchant else 0,
            "cover_image": merchant.get("coverImage", "") if merchant else "",
        }
    }

    return store


@router.get("/products")
@router.get("/products/")
async def list_all_public_products():
    """Get all products from all published merchants for the marketplace."""
    db = await get_database()

    # Get all published merchant IDs
    published_configs = await db.store_configs.find(
        {"is_published": True}, {"merchant_id": 1}
    ).to_list(None)
    published_merchant_ids = [c["merchant_id"] for c in published_configs]

    if not published_merchant_ids:
        return []

    # Get all products from those merchants
    products = []
    cursor = db.products.find({"merchant_id": {"$in": published_merchant_ids}})
    async for product in cursor:
        product["id"] = str(product["_id"])
        product.pop("_id", None)

        # Attach merchant store name
        merchant_id = product.get("merchant_id")
        config = next((c for c in published_configs if c.get("merchant_id") == merchant_id), None)
        if config:
            store_config = await db.store_configs.find_one({"merchant_id": merchant_id})
            if store_config:
                product["merchantName"] = store_config.get("store_name", "Store")
                product["merchantSubdomain"] = store_config.get("subdomain", "")

        products.append(product)

    return products
