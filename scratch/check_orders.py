import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json

async def check_orders():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.ecommerce
    
    orders = await db.orders.find().to_list(100)
    print(f"Total Orders: {len(orders)}")
    for o in orders:
        o["_id"] = str(o["_id"])
        if "date" in o: o["date"] = str(o["date"])
        print(json.dumps(o, indent=2))

if __name__ == "__main__":
    asyncio.run(check_orders())
