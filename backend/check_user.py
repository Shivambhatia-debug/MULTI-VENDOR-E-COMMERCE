import asyncio
from app.database import get_database, connect_to_mongo

async def check_user():
    await connect_to_mongo()
    db = await get_database()
    
    user = await db.users.find_one({"email": "shivam@gmail.com"})
    if user:
        print("FOUND USER:")
        for k, v in user.items():
            print(f"  {k}: {v} ({type(v)})")
    else:
        print("USER NOT FOUND")
        # Check all users
        users = await db.users.find().to_list(None)
        print(f"TOTAL USERS: {len(users)}")
        for u in users:
            print(f"  - {u.get('email')} ({u.get('role')})")

if __name__ == "__main__":
    asyncio.run(check_user())
