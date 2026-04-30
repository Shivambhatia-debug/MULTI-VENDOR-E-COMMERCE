import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.utils.auth import get_password_hash

async def seed_data():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Clear existing data to avoid duplicates
    await db.users.delete_many({"email": {"$in": ["basic@golalita.com", "premium@golalita.com", "mobile@golalita.com"]}})
    await db.merchants.delete_many({"email": {"$in": ["basic@golalita.com", "premium@golalita.com", "mobile@golalita.com"]}})

    # 1. Create Tiered Merchants
    tiers = [
        {"name": "Basic Merchant", "email": "basic@golalita.com", "plan": "Basic"},
        {"name": "Premium Merchant", "email": "premium@golalita.com", "plan": "Premium"},
        {"name": "Mobile Merchant", "email": "mobile@golalita.com", "plan": "Mobile App"},
    ]

    for tier in tiers:
        # Create User
        user = {
            "name": tier["name"],
            "email": tier["email"],
            "role": "merchant",
            "plan": tier["plan"],
            "password_hash": get_password_hash("password123"),
            "created_at": "2026-04-28T00:00:00Z"
        }
        user_result = await db.users.insert_one(user)
        user_id = str(user_result.inserted_id)

        # Create Merchant Profile
        profile = {
            "user_id": user_id,
            "name": f"{tier['name']}'s Store",
            "email": f"contact@{tier['email'].split('@')[1]}",
            "status": "Active",
            "stores": 1 if tier["plan"] == "Basic" else 3,
            "revenue": "0 QAR",
            "plan": tier["plan"],
            "joined": "2026-04-28",
            "category": "Retail"
        }
        await db.merchants.insert_one(profile)

        # Create 1 Sample Product
        product = {
            "name": f"Sample Product ({tier['plan']})",
            "price": 99.00,
            "description": "Standard sample product for system verification.",
            "category": "Electronics",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000",
            "sku": f"SKU-{tier['plan'][:3].upper()}-001",
            "stock": 50,
            "merchant_id": user_id,
            "status": "Active"
        }
        await db.products.insert_one(product)
    
    print("Seed data inserted successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
