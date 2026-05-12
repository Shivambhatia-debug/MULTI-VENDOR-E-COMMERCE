import asyncio
from app.database import get_database, connect_to_mongo
from app.config import settings

async def check():
    await connect_to_mongo()
    db = await get_database()
    plans = await db.plans.find().to_list(None)
    print(f"Total Plans Found: {len(plans)}")
    for p in plans:
        print(f"Plan: {p.get('name')} - Price: {p.get('price')}")

if __name__ == "__main__":
    asyncio.run(check())
