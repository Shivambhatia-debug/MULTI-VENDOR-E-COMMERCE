import asyncio
from app.database import get_database, connect_to_mongo

async def debug_store():
    await connect_to_mongo()
    db = await get_database()
    
    email = "shivambhatia19v@gmail.com"
    user = await db.users.find_one({"email": email})
    if not user:
        print("User not found")
        return
        
    print(f"USER: {user.get('name')}")
    print(f"  - store_slug: {user.get('store_slug')}")
    print(f"  - custom_domain: {user.get('custom_domain')}")
    
    config = await db.store_configs.find_one({"merchant_id": str(user["_id"])})
    if config:
        print(f"CONFIG:")
        print(f"  - store_name: {config.get('store_name')}")
        print(f"  - subdomain: {config.get('subdomain')}")
        print(f"  - custom_domain: {config.get('custom_domain')}")
    else:
        print("NO CONFIG FOUND")

if __name__ == "__main__":
    asyncio.run(debug_store())
