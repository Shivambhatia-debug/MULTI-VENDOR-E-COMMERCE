from fastapi import APIRouter, Depends
from ..database import get_database
from .auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"], redirect_slashes=False)

@router.get("/stats")
@router.get("/stats/")
async def get_stats(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    
    # 1. Total Products
    products_count = await db.products.count_documents({"merchant_id": merchant_id})
    
    # 2. Total Orders & Sales
    pipeline = [
        {"$match": {"merchant_id": merchant_id}},
        {"$group": {
            "_id": None,
            "total_sales": {"$sum": {"$toDouble": {"$trim": {"input": "$total", "chars": " QAR"}}}},
            "orders_count": {"$sum": 1}
        }}
    ]
    order_stats = await db.orders.aggregate(pipeline).to_list(1)
    stats_data = order_stats[0] if order_stats else {"total_sales": 0, "orders_count": 0}
    
    # 3. Unique Customers
    customer_pipeline = [
        {"$match": {"merchant_id": merchant_id}},
        {"$group": {"_id": "$customer_email"}}
    ]
    customers = await db.orders.aggregate(customer_pipeline).to_list(None)
    customers_count = len(customers)
    
    return [
        {"label": "Total Sales", "value": f"{int(stats_data['total_sales'])} QAR", "change": "+0%", "icon": "Briefcase"},
        {"label": "Total Orders", "value": str(stats_data['orders_count']), "change": "+0%", "icon": "ShoppingCart"},
        {"label": "Active Products", "value": str(products_count), "change": "+0%", "icon": "Package"},
        {"label": "New Customers", "value": str(customers_count), "change": "+0%", "icon": "Users"},
    ]
