import asyncio
from app.database import get_database, connect_to_mongo

async def reset_store():
    await connect_to_mongo()
    db = await get_database()
    
    email = "shivambhatia19v@gmail.com"
    user = await db.users.find_one({"email": email})
    if user:
        merchant_id = str(user["_id"])
        await db.store_configs.update_one(
            {"merchant_id": merchant_id},
            {"$set": {"is_approved": False, "is_published": True}}
        )
        print(f"RESET SUCCESS for {merchant_id}")

if __name__ == "__main__":
    asyncio.run(reset_store())
