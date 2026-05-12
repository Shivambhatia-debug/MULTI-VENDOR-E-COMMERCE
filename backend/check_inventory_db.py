import asyncio
from app.database import get_database, connect_to_mongo
from bson import ObjectId

async def check_db():
    await connect_to_mongo()
    db = await get_database()
    
    email = "shivambhatia19v@gmail.com"
    user = await db.users.find_one({"email": email})
    if not user:
        print("User not found")
        return
        
    user_id = str(user["_id"])
    print(f"User ID: {user_id}")
    print(f"User Plan: {user.get('plan')}")
    
    products = await db.products.find({"merchant_id": user_id}).to_list(None)
    print(f"Products found with merchant_id (string): {len(products)}")
    
    products_obj = await db.products.find({"merchant_id": user["_id"]}).to_list(None)
    print(f"Products found with merchant_id (ObjectId): {len(products_obj)}")

if __name__ == "__main__":
    asyncio.run(check_db())
