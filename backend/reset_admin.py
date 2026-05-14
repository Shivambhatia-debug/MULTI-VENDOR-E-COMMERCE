import asyncio
from app.database import get_database, connect_to_mongo
from app.utils.auth import get_password_hash

async def reset_admin():
    await connect_to_mongo()
    db = await get_database()
    
    email = "shivam@gmail.com"
    new_password = "shivam123"
    hashed_password = get_password_hash(new_password)
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"password_hash": hashed_password}}
    )
    
    if result.modified_count > 0:
        print(f"SUCCESS: Password for {email} updated to '{new_password}'")
    else:
        print(f"FAILED: User {email} not found or password already matches.")

if __name__ == "__main__":
    asyncio.run(reset_admin())
