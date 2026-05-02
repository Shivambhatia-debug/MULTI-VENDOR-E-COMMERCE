import requests
try:
    r = requests.get("http://localhost:8000/health")
    print(f"Health: {r.status_code} {r.json()}")
    r = requests.get("http://localhost:8000/api/store-config/")
    print(f"Config Root: {r.status_code}")
except Exception as e:
    print(f"Error: {e}")
