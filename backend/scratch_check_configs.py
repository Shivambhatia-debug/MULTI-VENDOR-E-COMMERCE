import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util

async def check():
    client = AsyncIOMotorClient("mongodb+srv://shivambhatia:shivambhatia@shivambhatia.2x7f9.mongodb.net/?retryWrites=true&w=majority&appName=shivambhatia")
    db = client.shivambhatia
    configs = await db.store_configs.find().to_list(10)
    print(json.dumps(json.loads(json_util.dumps(configs)), indent=2))

if __name__ == "__main__":
    asyncio.run(check())
