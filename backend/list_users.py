import asyncio
from app.database import get_database, connect_to_mongo

async def list_all_users():
    await connect_to_mongo()
    db = await get_database()
    users = await db.users.find().to_list(None)
    for u in users:
        print(f"Name: {u.get('name')} - Email: {u.get('email')} - Plan: {u.get('plan')} - Role: {u.get('role')}")

if __name__ == "__main__":
    asyncio.run(list_all_users())
