import asyncio
from app.database import get_database, connect_to_mongo

async def list_merchants():
    await connect_to_mongo()
    db = await get_database()
    merchants = await db.merchants.find().to_list(None)
    for m in merchants:
        print(f"User ID: {m.get('user_id')} - Plan: {m.get('plan')}")

if __name__ == "__main__":
    asyncio.run(list_merchants())
