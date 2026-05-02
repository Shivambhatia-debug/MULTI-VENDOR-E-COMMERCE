import requests
try:
    r = requests.get("http://localhost:8000/api/store-config/ping")
    print(f"Ping: {r.status_code} {r.json()}")
except Exception as e:
    print(f"Error: {e}")
