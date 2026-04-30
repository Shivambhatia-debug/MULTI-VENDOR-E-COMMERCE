from fastapi import APIRouter, Depends
from ..database import get_database
from .auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"], redirect_slashes=False)

@router.get("/stats")
@router.get("/stats/")
async def get_stats(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    # In a real app, these would be calculated based on DB queries
    # For now, we'll return structured data that matches the frontend
    
    products_count = await db.products.count_documents({"merchant_id": str(current_user["_id"])})
    orders_count = await db.orders.count_documents({"merchant_id": str(current_user["_id"])})
    
    return [
        {"label": "Total Sales", "value": "0 QAR", "change": "0%", "icon": "Briefcase"},
        {"label": "Total Orders", "value": str(orders_count), "change": "0%", "icon": "ShoppingCart"},
        {"label": "Active Products", "value": str(products_count), "change": "+0%", "icon": "Package"},
        {"label": "New Customers", "value": "0", "change": "0%", "icon": "Users"},
    ]
