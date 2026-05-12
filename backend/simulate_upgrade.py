import asyncio
from app.database import get_database, connect_to_mongo
from bson import ObjectId

async def upgrade():
    await connect_to_mongo()
    db = await get_database()
    
    # Find the premium merchant
    user = await db.users.find_one({"role": "merchant", "plan": "Premium"})
    if not user:
        # If no premium, find any merchant
        user = await db.users.find_one({"role": "merchant"})
        
    if user:
        print(f"Found User: {user.get('email')} with current plan: {user.get('plan')}")
        
        # Upgrade to Mobile App
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "plan": "Mobile App",
                "subscription_status": "active",
                "subscription_paid_at": user.get("subscription_paid_at") or asyncio.get_event_loop().time() # Dummy time if missing
            }}
        )
        
        # Also update merchants collection
        await db.merchants.update_one(
            {"user_id": str(user["_id"])},
            {"$set": {"plan": "Mobile App"}}
        )
        
        print(f"SUCCESS: Upgraded {user.get('email')} to Mobile App plan.")
    else:
        print("No merchant found to upgrade.")

if __name__ == "__main__":
    asyncio.run(upgrade())
