import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def test_conn():
    load_dotenv()
    url = os.getenv("MONGODB_URL")
    db_name = os.getenv("DATABASE_NAME")
    print(f"Testing connection to {url}")
    client = AsyncIOMotorClient(url, serverSelectionTimeoutMS=5000)
    try:
        await client[db_name].command("ping")
        print("SUCCESS: Connected to MongoDB Atlas")
    except Exception as e:
        print(f"FAILURE: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_conn())
