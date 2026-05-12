import asyncio
from app.database import get_database, connect_to_mongo
import json

async def test_api():
    await connect_to_mongo()
    db = await get_database()
    
    # Logic from admin.py
    merchants_users = await db.users.find({"role": "merchant"}).to_list(None)
    merchant_profiles = await db.merchants.find().to_list(None)
    profile_map = {p.get("user_id"): p for p in merchant_profiles}
    
    subscriptions = []
    for m in merchants_users:
        user_id = str(m["_id"])
        profile = profile_map.get(user_id, {})
        name = profile.get("store_name") or profile.get("business_name") or m.get("name") or "Unknown Merchant"
        
        subscriptions.append({
            "merchant_id": user_id,
            "merchant_name": name,
            "merchant_email": m.get("email", "No Email"),
            "plan": m.get("plan") or profile.get("plan") or "Basic",
        })
    
    print(json.dumps(subscriptions, indent=2))

if __name__ == "__main__":
    asyncio.run(test_api())
