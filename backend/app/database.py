from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    return db.client[settings.DATABASE_NAME]

async def connect_to_mongo():
    print(f">>> Connecting to MongoDB: {settings.DATABASE_NAME}...")
    try:
        # Set a short timeout for the initial connection check
        db.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=10000)
        database = db.client[settings.DATABASE_NAME]
        
        # This will trigger the actual connection
        print(">>> Verifying connection and creating indexes...")
        await asyncio.wait_for(
            database.otps.create_index("expire_at", expireAfterSeconds=0),
            timeout=10.0
        )
        print(">>> SUCCESS: Connected to MongoDB & Created TTL Indexes")
    except asyncio.TimeoutError:
        print("!!! ERROR: MongoDB connection timed out (10s). Check your network or MONGODB_URL.")
    except Exception as e:
        print(f"!!! ERROR: Failed to connect to MongoDB: {str(e)}")

async def close_mongo_connection():
    db.client.close()
    print("Closed MongoDB connection")
