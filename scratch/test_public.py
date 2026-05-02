import requests
try:
    r = requests.get("http://localhost:8000/api/public/stores")
    print(f"Public Stores: {r.status_code}")
except Exception as e:
    print(f"Error: {e}")
