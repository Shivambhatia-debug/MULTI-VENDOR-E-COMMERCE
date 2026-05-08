import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def check():
    url = "mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/"
    client = AsyncIOMotorClient(url)
    db = client.shivambhatia
    
    sid = "69f47aa5793357002e7fdfc4"
    config = await db.store_configs.find_one({"_id": ObjectId(sid)})
    
    if config:
        print(f"FOUND STORE: {config.get('store_name')}")
        print(f"IS PUBLISHED: {config.get('is_published')}")
        print(f"IS APPROVED: {config.get('is_approved')}")
        print(f"SUBDOMAIN: {config.get('subdomain')}")
    else:
        print("STORE NOT FOUND BY ID")
        config = await db.store_configs.find_one({"subdomain": sid})
        if config:
            print(f"FOUND BY SUBDOMAIN: {config.get('store_name')}")
            print(f"IS PUBLISHED: {config.get('is_published')}")
            print(f"IS APPROVED: {config.get('is_approved')}")

if __name__ == "__main__":
    asyncio.run(check())
