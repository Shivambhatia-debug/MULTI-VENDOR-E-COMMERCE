import asyncio
from app.database import get_database, connect_to_mongo
import json
from datetime import datetime

class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)

async def dump_all_users():
    await connect_to_mongo()
    db = await get_database()
    users = await db.users.find().to_list(None)
    for u in users:
        u["_id"] = str(u["_id"])
        u.pop("password", None)
        u.pop("hashed_password", None)
        print(json.dumps(u, indent=2, cls=DateTimeEncoder))

if __name__ == "__main__":
    asyncio.run(dump_all_users())
