import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_merchants():
    client = AsyncIOMotorClient("mongodb+srv://shivambhatia:Shiva%408053@cluster0.88cy4is.mongodb.net/")
    db = client.shivambhatia
    
    print("--- MERCHANTS ---")
    async for user in db.users.find({"role": "merchant"}):
        print(f"ID: {user['_id']}, Name: {user.get('name')}, Email: {user.get('email')}, Slug: {user.get('store_slug')}, Domain: {user.get('custom_domain')}")
        
    print("\n--- STORE CONFIGS ---")
    async for config in db.store_configs.find():
        print(f"MerchantID: {config.get('merchant_id')}, Subdomain: {config.get('subdomain')}, Custom: {config.get('custom_domain')}")

if __name__ == "__main__":
    asyncio.run(check_merchants())
