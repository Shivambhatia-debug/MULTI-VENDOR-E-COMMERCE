import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def check():
    url = "mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/"
    client = AsyncIOMotorClient(url)
    db = client.shivambhatia
    
    stores = await db.store_configs.find({}).to_list(None)
    
    print(f"TOTAL STORES: {len(stores)}")
    for s in stores:
        print(f"STORE: {s.get('store_name')} | PUBLISHED: {s.get('is_published')} | APPROVED: {s.get('is_approved')} | ID: {s.get('_id')}")

if __name__ == "__main__":
    asyncio.run(check())
