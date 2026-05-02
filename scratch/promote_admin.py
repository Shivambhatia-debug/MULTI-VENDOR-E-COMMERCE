import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def promote():
    client = AsyncIOMotorClient("mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/")
    db = client.shivambhatia
    email = "shivam@gmail.com"
    res = await db.users.update_one({"email": email}, {"$set": {"role": "admin"}})
    print(f"Successfully promoted {email}" if res.modified_count else "Failed")
    client.close()

if __name__ == "__main__":
    asyncio.run(promote())
