import asyncio
import httpx

async def test_lookup():
    async with httpx.AsyncClient() as client:
        # Test timestop.com
        res = await client.get("http://localhost:8000/api/public/lookup-store/timestop.com")
        print(f"Lookup timestop.com: {res.status_code}")
        if res.status_code == 200:
            print(res.json())
        else:
            print(res.text)
            
        # Test by subdomain
        res = await client.get("http://localhost:8000/api/public/lookup-store/timestop")
        print(f"Lookup timestop: {res.status_code}")
        if res.status_code == 200:
            print(res.json().get("config", {}).get("store_name"))

if __name__ == "__main__":
    asyncio.run(test_lookup())
