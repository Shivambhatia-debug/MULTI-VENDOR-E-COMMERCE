import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd()))

from app.database import get_database, connect_to_mongo
from app.config import settings

async def check():
    print(f"Connecting to {settings.DATABASE_NAME}...")
    await connect_to_mongo()
    db = await get_database()
    users = await db.users.find({"role": "merchant"}).to_list(None)
    print(f"MERCHANTS_COUNT: {len(users)}")
    for u in users:
        print(f"MERCHANT: {u.get('email')} - Plan: {u.get('plan')} - Status: {u.get('subscription_status')}")
    
    # Also check plans
    plans = await db.plans.find({}).to_list(None)
    print(f"PLANS_COUNT: {len(plans)}")
    for p in plans:
        print(f"PLAN: {p.get('name')} - Price: {p.get('price')}")

if __name__ == "__main__":
    asyncio.run(check())
