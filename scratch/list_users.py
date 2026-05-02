import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def list_users():
    client = AsyncIOMotorClient("mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/")
    db = client.shivambhatia
    users = await db.users.find().to_list(20)
    for u in users:
        print(f"Email: {u.get('email')}, Role: {u.get('role')}")
    client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
