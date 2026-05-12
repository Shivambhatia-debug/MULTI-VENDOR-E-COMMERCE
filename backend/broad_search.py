import asyncio
from app.database import get_database, connect_to_mongo

async def find_premium():
    await connect_to_mongo()
    db = await get_database()
    users = await db.users.find({"plan": {"$regex": "premium", "$options": "i"}}).to_list(None)
    print(f"Found {len(users)} users with 'premium' plan")
    for u in users:
        print(f"Email: {u.get('email')} - Plan: {u.get('plan')}")

if __name__ == "__main__":
    asyncio.run(find_premium())
