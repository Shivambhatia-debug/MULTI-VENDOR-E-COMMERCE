import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def check():
    url = "mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/"
    client = AsyncIOMotorClient(url)
    db = client.shivambhatia
    
    # A store is pending if it's published by merchant but not yet approved by admin
    pending_stores = await db.store_configs.find({
        "is_published": True, 
        "is_approved": {"$ne": True}
    }).to_list(None)
    
    print(f"TOTAL PENDING STORES FOUND: {len(pending_stores)}")
    for s in pending_stores:
        print(f"STORE: {s.get('store_name')} | MERCHANT_ID: {s.get('merchant_id')} | ID: {s.get('_id')}")

if __name__ == "__main__":
    asyncio.run(check())
