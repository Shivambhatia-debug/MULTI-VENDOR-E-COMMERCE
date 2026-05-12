import asyncio
from app.database import get_database, connect_to_mongo

async def check_plans():
    await connect_to_mongo()
    db = await get_database()
    plans = await db.plans.find().to_list(None)
    for p in plans:
        print(f"Plan ID: {p.get('_id')} - Name: {p.get('name')} - Price: {p.get('price')}")

if __name__ == "__main__":
    asyncio.run(check_plans())
