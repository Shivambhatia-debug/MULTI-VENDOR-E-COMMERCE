import asyncio
from app.database import get_database, connect_to_mongo
from bson import ObjectId

async def super_clean_upgrade():
    await connect_to_mongo()
    db = await get_database()
    
    email = "shivambhatia19v@gmail.com"
    user = await db.users.find_one({"email": email})
    
    if user:
        # Update User
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "plan": "Mobile App",
                "subscription_status": "active",
                "pending_plan": None
            }}
        )
        
        # Update Merchant record explicitly
        await db.merchants.update_one(
            {"user_id": str(user["_id"])},
            {"$set": {"plan": "Mobile App"}},
            upsert=True # Ensure it exists
        )
        
        print(f"SUCCESS: Super clean upgrade for {email}")
    else:
        print("User not found.")

if __name__ == "__main__":
    asyncio.run(super_clean_upgrade())
