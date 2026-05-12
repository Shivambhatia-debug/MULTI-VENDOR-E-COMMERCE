import asyncio
from app.database import get_database, connect_to_mongo

async def set_store_slug():
    await connect_to_mongo()
    db = await get_database()
    
    email = "shivambhatia19v@gmail.com"
    await db.users.update_one(
        {"email": email},
        {"$set": {"store_slug": "timestop.com"}}
    )
    
    print(f"SUCCESS: Set store_slug 'timestop.com' for {email}")

if __name__ == "__main__":
    asyncio.run(set_store_slug())
