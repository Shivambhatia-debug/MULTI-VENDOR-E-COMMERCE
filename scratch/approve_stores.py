import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

async def approve_all():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DATABASE_NAME")]
    await db.store_configs.update_many({"is_published": True}, {"$set": {"is_approved": True}})
    print("All existing published stores marked as approved.")
    client.close()

if __name__ == "__main__":
    asyncio.run(approve_all())
