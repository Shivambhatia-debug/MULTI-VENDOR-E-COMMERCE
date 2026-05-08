import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime

async def check():
    url = "mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/"
    client = AsyncIOMotorClient(url)
    db = client.shivambhatia
    
    # Let's find the 'Admin User' store and publish it
    sid = "69fb0435a1692cc0f5e494f5"
    result = await db.store_configs.update_one(
        {"_id": ObjectId(sid)},
        {"$set": {"is_published": True, "updated_at": datetime.utcnow().isoformat()}}
    )
    
    if result.modified_count > 0:
        print("STORE PUBLISHED SUCCESSFULLY")
    else:
        print("STORE NOT UPDATED (Maybe already published or ID wrong)")

if __name__ == "__main__":
    asyncio.run(check())
