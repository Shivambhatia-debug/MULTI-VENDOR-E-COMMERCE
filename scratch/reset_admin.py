import asyncio
import os
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

async def reset_admin():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DATABASE_NAME")]
    
    email = "shivam@gmail.com"
    password = "admin123"
    
    # Create new hash with our new direct bcrypt logic
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt).decode("utf-8")
    
    # Update or Create admin user
    user = await db.users.find_one({"email": email})
    
    if user:
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "password_hash": hashed,
                "role": "admin",
                "name": "Super Admin"
            }}
        )
        print(f"Password reset successful for {email}")
    else:
        # Create new if not exists
        await db.users.insert_one({
            "email": email,
            "password_hash": hashed,
            "role": "admin",
            "name": "Super Admin",
            "plan": "Enterprise",
            "status": "Active"
        })
        print(f"Admin user created: {email}")

    client.close()

if __name__ == "__main__":
    asyncio.run(reset_admin())
