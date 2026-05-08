
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_db():
    mongodb_url = "mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/"
    client = AsyncIOMotorClient(mongodb_url)
    db = client["shivambhatia"]
    
    print("--- Database Check ---")
    
    stores_count = await db.store_configs.count_documents({})
    published_count = await db.store_configs.count_documents({"is_published": True, "is_approved": True})
    print(f"Total stores: {stores_count}")
    print(f"Published & Approved stores: {published_count}")
    
    products_count = await db.products.count_documents({})
    print(f"Total products: {products_count}")
    
    if published_count > 0:
        published_configs = await db.store_configs.find({"is_published": True, "is_approved": True}).to_list(None)
        merchant_ids = [c["merchant_id"] for c in published_configs]
        print(f"Merchant IDs with published stores: {merchant_ids}")
        
        products_for_published = await db.products.count_documents({"merchant_id": {"$in": merchant_ids}})
        print(f"Products for published stores: {products_for_published}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
