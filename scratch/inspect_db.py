import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

async def check_db():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DATABASE_NAME")]
    
    print(f"Checking database: {os.getenv('DATABASE_NAME')}")
    
    # Check users and roles
    roles_count = await db.users.aggregate([
        {"$group": {"_id": "$role", "count": {"$sum": 1}}}
    ]).to_list(None)
    
    print("\nUser Roles:")
    for r in roles_count:
        print(f"  {r['_id']}: {r['count']}")
        
    # Check stores
    stores_count = await db.stores.count_documents({})
    print(f"\nTotal Stores: {stores_count}")
    
    # List some users
    users = await db.users.find({}).limit(5).to_list(None)
    print("\nSample Users:")
    for u in users:
        print(f"  {u.get('email')} - {u.get('role')}")

    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
