import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os
from dotenv import load_dotenv

# Load settings from .env
load_dotenv()

async def test_connection():
    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url or "<db_password>" in mongodb_url:
        print("ERROR: Please replace <db_password> in backend/.env with your actual MongoDB Atlas password.")
        return

    print(f"Connecting to: {mongodb_url.split('@')[-1]}...")
    try:
        client = AsyncIOMotorClient(mongodb_url)
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("SUCCESS: Connected to MongoDB Atlas!")
    except Exception as e:
        print(f"CONNECTION ERROR: {e}")
        print("\nPossible solutions:")
        print("1. Check if your password is correct.")
        print("2. Check if your IP address is whitelisted in MongoDB Atlas.")
        print("3. Ensure the connection string in .env is correct.")

if __name__ == "__main__":
    asyncio.run(test_connection())
