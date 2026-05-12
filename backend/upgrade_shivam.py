import asyncio
from app.database import get_database, connect_to_mongo
from bson import ObjectId

async def upgrade_shivam():
    await connect_to_mongo()
    db = await get_database()
    
    # Find the merchant named Shivam
    user = await db.users.find_one({"role": "merchant", "name": "SHIVAM"})
    if not user:
        # Try lowercase or case-insensitive if needed, but SHIVAM is seen in the UI screenshot
        user = await db.users.find_one({"role": "merchant", "name": {"$regex": "^shivam$", "$options": "i"}})
        
    if user:
        print(f"Found User: {user.get('email')} ({user.get('name')}) with current plan: {user.get('plan')}")
        
        # Upgrade to Mobile App
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "plan": "Mobile App",
                "subscription_status": "active",
                "subscription_paid_at": user.get("subscription_paid_at") or asyncio.get_event_loop().time() 
            }}
        )
        
        # Also update merchants collection
        await db.merchants.update_one(
            {"user_id": str(user["_id"])},
            {"$set": {"plan": "Mobile App"}}
        )
        
        print(f"SUCCESS: Upgraded {user.get('email')} to Mobile App plan.")
    else:
        # List all merchants to see names
        merchants = await db.users.find({"role": "merchant"}).to_list(None)
        print("Merchants in DB:")
        for m in merchants:
            print(f"- {m.get('name')} ({m.get('email')})")

if __name__ == "__main__":
    asyncio.run(upgrade_shivam())
