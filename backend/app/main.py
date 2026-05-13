from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, products, orders, dashboard, merchants, public_stores, admin, user_actions
from app.routes.store_config import router as store_config_router
from app.routes.skipcash import router as skipcash_router
from app.routes.subscriptions import router as subscriptions_router
from app.routes.public import router as public_router
from app.routes.nexus_ai import router as nexus_ai_router
from pydantic import BaseModel
from typing import Optional

class NexusChatRequest(BaseModel):
    message: str
    role: Optional[str] = "customer"
    merchant_id: Optional[str] = None

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
app.include_router(auth.router, prefix="/api/auth")
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(merchants.router)
app.include_router(public_stores.router)
app.include_router(admin.router, prefix="/api/admin")
app.include_router(user_actions.router)
app.include_router(skipcash_router)
app.include_router(subscriptions_router)
app.include_router(public_router, prefix="/api/public")
app.include_router(nexus_ai_router)

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

@app.get("/api/admin/test-route")
@app.get("/api/admin/test-route/")
async def test_route():
    return [{"id": "1", "name": "Test Works"}]

@app.get("/")
async def root():
    return {"message": "Welcome to Golalita E-Commerce API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/nexus/autonomous-nexus")
async def nexus_chat_direct(request: NexusChatRequest):
    print(f"!!! DIRECT NEXUS HIT !!! Role: {request.role}, Msg: {request.message}")
    # Simple direct logic for testing
    return {
        "agent_id": "strategy_agent",
        "agent_name": "Nexus Direct",
        "content": f"Direct Protocol Initialized. Identity: {request.role.upper()}. Database connection stable. How can I assist?",
        "metadata": {"direct_mode": True}
    }

@app.get("/api/admin/test-route")
async def test_route():
    return [{"id": "1", "name": "Test Works"}]
