import asyncio
from app.database import get_database, connect_to_mongo

async def run():
    await connect_to_mongo()
    db = await get_database()
    count = await db.users.count_documents({'role': 'merchant', 'plan': 'Basic'})
    print(f'Merchants with Basic plan: {count}')
    
    # Reset plans to None for those on Basic
    result = await db.users.update_many(
        {'role': 'merchant', 'plan': 'Basic'}, 
        {'$set': {'plan': 'None', 'subscription_status': 'none'}}
    )
    print(f'Updated {result.modified_count} users')
    
    result_m = await db.merchants.update_many(
        {'plan': 'Basic'}, 
        {'$set': {'plan': 'None'}}
    )
    print(f'Updated {result_m.modified_count} merchant records')

if __name__ == "__main__":
    asyncio.run(run())
