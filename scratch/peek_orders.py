import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json

async def peek():
    client = AsyncIOMotorClient("mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/")
    db = client.shivambhatia
    order = await db.orders.find_one()
    print(json.dumps(order, indent=2, default=str))
    client.close()

if __name__ == "__main__":
    asyncio.run(peek())
