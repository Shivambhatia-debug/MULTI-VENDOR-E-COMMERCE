import asyncio
from app.database import get_database, connect_to_mongo

async def add_dummy_product():
    await connect_to_mongo()
    db = await get_database()
    
    user = await db.users.find_one({"email": "shivambhatia19v@gmail.com"})
    if user:
        merchant_id = str(user["_id"])
        product = {
            "name": "Timestop Chrono X",
            "price": 299.99,
            "description": "Premium luxury timepiece for the modern professional.",
            "category": "Watches",
            "merchant_id": merchant_id,
            "image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600"
        }
        await db.products.insert_one(product)
        print(f"SUCCESS: Added dummy product for {merchant_id}")

if __name__ == "__main__":
    asyncio.run(add_dummy_product())
