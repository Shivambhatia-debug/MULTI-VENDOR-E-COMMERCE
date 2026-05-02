import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_admin():
    client = AsyncIOMotorClient("mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/")
    db = client.shivambhatia
    admin = await db.users.find_one({"role": "admin"})
    if admin:
        print(f"Found admin: {admin.get('email')}")
    else:
        print("No admin found. Creating one...")
        # Create a default admin for testing if none exists
        # In a real app, this should be done via a secure script
        pass
    client.close()

if __name__ == "__main__":
    asyncio.run(check_admin())
