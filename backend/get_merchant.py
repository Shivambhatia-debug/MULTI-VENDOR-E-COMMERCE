import asyncio
import os
from app.database import get_database, connect_to_mongo

async def main():
    await connect_to_mongo()
    db = await get_database()
    merchant = await db.users.find_one({"role": "merchant"})
    if merchant:
        print(f"MERCHANT_ID:{str(merchant['_id'])}")
    else:
        print("NO_MERCHANT_FOUND")

if __name__ == "__main__":
    asyncio.run(main())
