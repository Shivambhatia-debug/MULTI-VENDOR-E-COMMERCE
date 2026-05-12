import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['golalita']
    docs = await db.store_configs.find({}).to_list(None)
    for doc in docs:
        print("STORE:", doc.get("store_name"))
        print("CUSTOM:", doc.get("custom_domain"))
        print("STATUS:", doc.get("domain_status"))

asyncio.run(main())
