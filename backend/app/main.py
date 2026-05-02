from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from .database import connect_to_mongo, close_mongo_connection
from .routes import auth, products, orders, dashboard, merchants, public_stores, admin
from .routes.store_config import router as store_config_router

app = FastAPI(title="Golalita E-Commerce API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    print(f">>> {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        duration = time.time() - start_time
        print(f"<<< {request.method} {request.url.path} -> {response.status_code} ({duration:.2f}s)")
        return response
    except Exception as e:
        print(f"!!! ERROR {request.method} {request.url.path} - {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": str(e)})

# Include Routers
app.include_router(store_config_router, prefix="/api/store-config")
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(merchants.router)
app.include_router(public_stores.router)
app.include_router(admin.router)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    # Print all registered routes for debugging
    print("\n=== REGISTERED ROUTES ===")
    for route in app.routes:
        if hasattr(route, 'methods'):
            print(f"  {route.methods} {route.path}")
    print("=========================\n")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def catch_all(request: Request, full_path: str):
    return {
        "message": "Debug: Route not found",
        "path": full_path,
        "method": request.method,
        "root_path": request.scope.get("root_path"),
        "headers": dict(request.headers)
    }

@app.get("/")
async def root():
    return {"message": "Welcome to Golalita E-Commerce API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
