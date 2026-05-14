import asyncio
from app.database import get_database, connect_to_mongo
from app.utils.auth import get_password_hash
from datetime import datetime

async def fix_admin():
    await connect_to_mongo()
    db = await get_database()
    
    email = "shivam@gmail.com"
    new_password = "shivam123"
    hashed_password = get_password_hash(new_password)
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {
            "password_hash": hashed_password,
            "subscription_status": "active",
            "plan": "Mobile App",
            "phone": None,
            "trial_start": None,
            "trial_end": None,
            "subscription_paid_at": None,
            "store_slug": None,
            "custom_domain": None,
            "created_at": datetime(2026, 4, 28, 8, 37, 41)
        }}
    )
    
    if result.modified_count > 0:
        print(f"SUCCESS: Admin user '{email}' fully updated!")
        print(f"  Password: {new_password}")
        print(f"  Role: admin")
        print(f"  All required fields added.")
    else:
        print(f"FAILED: User {email} not found.")

if __name__ == "__main__":
    asyncio.run(fix_admin())
