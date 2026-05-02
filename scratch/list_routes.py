from backend.app.main import app
for route in app.routes:
    print(f"{route.path} [{route.methods}]")
