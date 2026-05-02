import requests
try:
    r = requests.get("http://localhost:8000/api/test")
    print(f"Test Route: {r.status_code} {r.json()}")
except Exception as e:
    print(f"Error: {e}")
