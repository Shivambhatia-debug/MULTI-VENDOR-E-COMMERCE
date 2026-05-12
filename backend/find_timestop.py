import asyncio
from app.database import get_database, connect_to_mongo

async def find_timestop():
    await connect_to_mongo()
    db = await get_database()
    merchant = await db.merchants.find_one({"name": {"$regex": "timestop", "$options": "i"}})
    print(f"Merchant: {merchant}")

if __name__ == "__main__":
    asyncio.run(find_timestop())
