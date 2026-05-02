import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os
from datetime import datetime, timedelta

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
import os

# Load .env from absolute path
load_dotenv(dotenv_path="C:\\Users\\shiva\\Golalita E-Commerce\\backend\\.env")

from app.config import settings

async def seed_v2():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Get all merchant users
    merchants = await db.users.find({"role": "merchant"}).to_list(None)
    
    if not merchants:
        print("No merchants found. Run seed.py first.")
        return

    for merchant in merchants:
        m_id = str(merchant["_id"])
        m_name = merchant["name"]
        
        print(f"Seeding data for {m_name}...")

        # 1. Clear existing dynamic data for this merchant
        await db.branches.delete_many({"merchant_id": m_id})
        await db.coupons.delete_many({"merchant_id": m_id})
        await db.orders.delete_many({"merchant_id": m_id})

        # 2. Seed Branches
        branches = [
            {
                "merchant_id": m_id,
                "name": f"{m_name} - Main Branch",
                "city": "Doha",
                "address": "Al Corniche, Doha, Qatar",
                "phone": "+974 4444 1111",
                "hours": "09:00 AM - 10:00 PM",
                "status": "Active"
            }
        ]
        if merchant["plan"] != "Basic":
            branches.append({
                "merchant_id": m_id,
                "name": f"{m_name} - Al Wakrah",
                "city": "Al Wakrah",
                "address": "Main Street, Al Wakrah, Qatar",
                "phone": "+974 4444 2222",
                "hours": "10:00 AM - 11:00 PM",
                "status": "Active"
            })
        
        await db.branches.insert_many(branches)

        # 3. Seed Coupons
        coupons = [
            {
                "merchant_id": m_id,
                "code": "WELCOME10",
                "type": "Percentage",
                "value": "10%",
                "usage": 45,
                "expiry": "2026-12-31",
                "status": "Active"
            },
            {
                "merchant_id": m_id,
                "code": "OFFER50",
                "type": "Fixed Amount",
                "value": "50 QAR",
                "usage": 12,
                "expiry": "2026-05-30",
                "status": "Active"
            }
        ]
        await db.coupons.insert_many(coupons)

        # 4. Seed Orders (to generate Customers dynamically)
        customers = [
            {"name": "Ahmed Abdullah", "email": "ahmed@example.qa", "phone": "+974 5555 1234"},
            {"name": "Sara Smith", "email": "sara@gmail.com", "phone": "+974 3333 5678"},
            {"name": "John Doe", "email": "john.doe@yahoo.com", "phone": "+974 7777 8888"},
            {"name": "Fatima Hassan", "email": "fatima@qatar.net", "phone": "+974 6666 9999"},
        ]

        orders = []
        for i in range(10): # 10 orders per merchant
            cust = customers[i % len(customers)]
            order_date = datetime.utcnow() - timedelta(days=i*2)
            orders.append({
                "merchant_id": m_id,
                "customer_name": cust["name"],
                "customer_email": cust["email"],
                "customer_phone": cust["phone"],
                "items": (i % 3) + 1,
                "total": f"{(i+1) * 125} QAR",
                "status": "Fulfilled" if i > 2 else "Processing",
                "method": "Online" if i % 2 == 0 else "COD",
                "date": order_date
            })
        
        await db.orders.insert_many(orders)

    print("Advanced seeding complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_v2())
