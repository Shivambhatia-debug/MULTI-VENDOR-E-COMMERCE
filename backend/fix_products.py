import asyncio
from app.database import get_database, connect_to_mongo

async def fix_products():
    await connect_to_mongo()
    db = await get_database()
    
    # Update all products to have mandatory fields if missing
    result = await db.products.update_many(
        {"sku": {"$exists": False}},
        {"$set": {"sku": "SKU-GEN-001"}}
    )
    print(f"Fixed SKU for {result.modified_count} products")
    
    result = await db.products.update_many(
        {"status": {"$exists": False}},
        {"$set": {"status": "Active"}}
    )
    print(f"Fixed Status for {result.modified_count} products")

    result = await db.products.update_many(
        {"stock": {"$exists": False}},
        {"$set": {"stock": 100}}
    )
    print(f"Fixed Stock for {result.modified_count} products")

if __name__ == "__main__":
    asyncio.run(fix_products())
