import asyncio
from app.database import get_database, connect_to_mongo

async def test_exact_query():
    await connect_to_mongo()
    db = await get_database()
    
    identifier = "timestop.com"
    
    # 1. Store Configs
    config = await db.store_configs.find_one({
        "$or": [
            {"custom_domain": identifier},
            {"subdomain": identifier.split('.')[0]}
        ]
    })
    print(f"Config find result: {config is not None}")
    
    # 2. Users
    user = await db.users.find_one({
        "$or": [
            {"store_slug": identifier},
            {"custom_domain": identifier}
        ]
    })
    print(f"User find result: {user is not None}")
    if user:
        print(f"User name: {user.get('name')}")

if __name__ == "__main__":
    asyncio.run(test_exact_query())
