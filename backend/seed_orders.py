import asyncio
from app.database import get_database, connect_to_mongo
from datetime import datetime
import random

async def main():
    await connect_to_mongo()
    db = await get_database()
    
    merchant_id = "69f05cef1386ddad5b2a8942"
    
    # Clear existing orders for a fresh start (optional, but good for seeding)
    await db.orders.delete_many({"merchant_id": merchant_id})
    
    mock_orders = [
        {"customer_name": "Ahmed Abdullah", "items": 3, "total": "450 QAR", "status": "Processing", "method": "Online"},
        {"customer_name": "Sara Smith", "items": 1, "total": "120 QAR", "status": "Pending", "method": "COD"},
        {"customer_name": "Khalid Al-Mansour", "items": 2, "total": "890 QAR", "status": "Fulfilled", "method": "Online"},
        {"customer_name": "Noora Hassan", "items": 5, "total": "1,200 QAR", "status": "Processing", "method": "Online"},
        {"customer_name": "Mohammed Ali", "items": 1, "total": "75 QAR", "status": "Processing", "method": "Cash"},
        {"customer_name": "Fatima Zahra", "items": 4, "total": "560 QAR", "status": "Pending", "method": "Online"},
        {"customer_name": "John Doe", "items": 2, "total": "210 QAR", "status": "Fulfilled", "method": "Online"},
        {"customer_name": "Zaid Ibrahim", "items": 3, "total": "345 QAR", "status": "Processing", "method": "Online"},
        {"customer_name": "Layla Kareem", "items": 1, "total": "90 QAR", "status": "Pending", "method": "COD"},
        {"customer_name": "Omar Farooq", "items": 6, "total": "2,150 QAR", "status": "Fulfilled", "method": "Online"},
        {"customer_name": "Aisha Bint", "items": 2, "total": "180 QAR", "status": "Processing", "method": "Online"},
        {"customer_name": "Yousuf Khan", "items": 3, "total": "320 QAR", "status": "Pending", "method": "Credit Card"}
    ]
    
    for order in mock_orders:
        order["merchant_id"] = merchant_id
        order["date"] = datetime.utcnow()
        await db.orders.insert_one(order)
        
    print(f"Seeded {len(mock_orders)} orders for merchant {merchant_id}")

if __name__ == "__main__":
    asyncio.run(main())
