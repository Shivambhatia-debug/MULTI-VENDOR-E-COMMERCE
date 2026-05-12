import asyncio
from app.database import get_database, connect_to_mongo
import json

async def check_merchant_store():
    await connect_to_mongo()
    db = await get_database()
    
    # Find Shivam
    user = await db.users.find_one({"email": "shivambhatia19v@gmail.com"})
    if user:
        merchant = await db.merchants.find_one({"user_id": str(user["_id"])})
        print(json.dumps(merchant, indent=2, default=str))
    else:
        print("Shivam not found.")

if __name__ == "__main__":
    asyncio.run(check_merchant_store())
