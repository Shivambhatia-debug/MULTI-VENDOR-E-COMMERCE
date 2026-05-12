import asyncio
from app.database import get_database, connect_to_mongo

async def check_all_shivams():
    await connect_to_mongo()
    db = await get_database()
    users = await db.users.find({"name": {"$regex": "shivam", "$options": "i"}}).to_list(None)
    print(f"Found {len(users)} users matching 'shivam'")
    for u in users:
        print(f"Email: {u.get('email')} - Name: {u.get('name')} - Plan: {u.get('plan')}")

if __name__ == "__main__":
    asyncio.run(check_all_shivams())
