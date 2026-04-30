from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from .database import connect_to_mongo, close_mongo_connection
from .routes import auth, products, orders, dashboard, merchants

app = FastAPI(title="Golalita E-Commerce API", redirect_slashes=False)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        print(f"DEBUG: ERROR {request.method} {request.url} - {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": str(e)})

# Include Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(merchants.router)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to Golalita E-Commerce API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
