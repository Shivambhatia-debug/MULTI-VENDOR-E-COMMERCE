from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    return db.client[settings.DATABASE_NAME]

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    # Create TTL index for OTPs (10 minutes)
    database = db.client[settings.DATABASE_NAME]
    await database.otps.create_index("expire_at", expireAfterSeconds=0)
    print("Connected to MongoDB & Created TTL Indexes")

async def close_mongo_connection():
    db.client.close()
    print("Closed MongoDB connection")
