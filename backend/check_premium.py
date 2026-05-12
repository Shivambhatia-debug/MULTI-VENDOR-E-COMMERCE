import asyncio
from app.database import get_database, connect_to_mongo

async def check_premium_merchants():
    await connect_to_mongo()
    db = await get_database()
    users = await db.users.find({"role": "merchant", "plan": "Premium"}).to_list(None)
    print(f"Found {len(users)} premium merchants")
    for u in users:
        print(f"Email: {u.get('email')} - Name: {u.get('name')}")

if __name__ == "__main__":
    asyncio.run(check_premium_merchants())
