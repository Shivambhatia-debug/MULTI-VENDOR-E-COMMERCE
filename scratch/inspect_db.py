import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Path to backend/.env
load_dotenv(dotenv_path='backend/.env')

async def main():
    mongo_url = os.getenv("MONGODB_URL")
    db_name = os.getenv("DATABASE_NAME", "shivambhatia")
    
    if not mongo_url:
        print("Error: MONGODB_URL not found in .env")
        return

    print(f"Connecting to {db_name}...")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    collections = await db.list_collection_names()
    print("Collections:", collections)
    
    for coll_name in collections:
        count = await db[coll_name].count_documents({})
        print(f"{coll_name}: {count} documents")
        if count > 0:
            doc = await db[coll_name].find_one()
            print(f"  Sample {coll_name}: {doc.keys()}")

if __name__ == "__main__":
    asyncio.run(main())
