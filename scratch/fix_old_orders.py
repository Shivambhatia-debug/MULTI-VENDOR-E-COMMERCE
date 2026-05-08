import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def fix_orders():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.ecommerce
    
    mock_item = {
        "id": "mock_id",
        "name": "Premium Plan",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
        "price": 100,
        "quantity": 1
    }
    
    result = await db.orders.update_many(
        {"items_details": {"$exists": False}},
        {"$set": {"items_details": [mock_item]}}
    )
    print(f"Updated {result.modified_count} old orders.")

if __name__ == "__main__":
    asyncio.run(fix_orders())
