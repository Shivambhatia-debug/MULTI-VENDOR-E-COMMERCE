import asyncio
from app.database import get_database, connect_to_mongo
from bson import ObjectId

async def force_upgrade_shivam():
    await connect_to_mongo()
    db = await get_database()
    
    # Find user by email (as seen in previous output)
    email = "shivambhatia19v@gmail.com"
    user = await db.users.find_one({"email": email})
    
    if user:
        user_id_str = str(user["_id"])
        print(f"Forcing upgrade for {email} (ID: {user_id_str})")
        
        # Update Users
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "plan": "Mobile App",
                "subscription_status": "active",
                "subscription_paid_at": user.get("subscription_paid_at") or asyncio.get_event_loop().time()
            }}
        )
        
        # Update Merchants
        await db.merchants.update_one(
            {"user_id": user_id_str},
            {"$set": {"plan": "Mobile App"}},
            upsert=False
        )
        
        # Verify
        updated_user = await db.users.find_one({"_id": user["_id"]})
        updated_merchant = await db.merchants.find_one({"user_id": user_id_str})
        
        print(f"User Plan: {updated_user.get('plan')}")
        print(f"Merchant Plan: {updated_merchant.get('plan') if updated_merchant else 'NOT FOUND IN MERCHANTS'}")
        
    else:
        print(f"User with email {email} not found.")

if __name__ == "__main__":
    asyncio.run(force_upgrade_shivam())
