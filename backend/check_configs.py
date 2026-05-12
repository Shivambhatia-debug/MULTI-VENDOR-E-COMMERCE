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
    
    config = await db.store_configs.find_one({"merchant_id": user_id})
    if config:
        print(f"Store Config found: {config.get('store_name')}")
        print(f"is_published: {config.get('is_published')}")
        print(f"is_approved: {config.get('is_approved')}")
    else:
        print("No Store Config found for this merchant ID string")
        
        # Check if it's stored as ObjectId by any chance
        config_obj = await db.store_configs.find_one({"merchant_id": user["_id"]})
        if config_obj:
            print("FOUND STORE CONFIG WITH OBJECTID merchant_id")
        else:
            # Check all configs
            all_configs = await db.store_configs.find().to_list(None)
            print(f"Total store configs in DB: {len(all_configs)}")
            for c in all_configs:
                print(f"  - Store: {c.get('store_name')}, Merchant: {c.get('merchant_id')}")

if __name__ == "__main__":
    asyncio.run(check_db())
