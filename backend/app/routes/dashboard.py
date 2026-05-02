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

@router.get("/analytics")
@router.get("/analytics/")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    
    # 1. Revenue Trajectory (Real Data from DB)
    trajectory_pipeline = [
        {"$match": {"merchant_id": merchant_id}},
        {"$project": {
            "month": {"$substr": ["$date", 0, 7]}, # "YYYY-MM"
            "revenue": {"$toDouble": {"$trim": {"input": "$total", "chars": " QAR"}}}
        }},
        {"$group": {
            "_id": "$month",
            "revenue": {"$sum": "$revenue"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    trajectory_results = await db.orders.aggregate(trajectory_pipeline).to_list(None)
    
    # Map month strings to names
    month_names = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
        "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    }
    
    trajectory = []
    for res in trajectory_results:
        month_num = res['_id'].split("-")[1]
        trajectory.append({
            "month": month_names.get(month_num, res['_id']),
            "revenue": res['revenue'],
            "orders": res['count']
        })
    
    # If no data, provide an empty list or at least handle it gracefully in UI
    if not trajectory:
        # Fallback to current month if empty to avoid empty chart
        import datetime
        now = datetime.datetime.now()
        trajectory = [{"month": now.strftime("%b"), "revenue": 0, "orders": 0}]

    # 2. Channel Intelligence (Real Data from DB)
    channel_pipeline = [
        {"$match": {"merchant_id": merchant_id}},
        {"$group": {
            "_id": "$method",
            "count": {"$sum": 1}
        }}
    ]
    channels = await db.orders.aggregate(channel_pipeline).to_list(None)
    
    # Map to UI format
    channel_data = []
    total_orders = sum(c['count'] for c in channels) if channels else 1
    for c in channels:
        label = c['_id'] if c['_id'] else "Direct"
        percentage = round((c['count'] / total_orders) * 100, 1)
        channel_data.append({"label": label, "value": f"{percentage}%", "raw": c['count']})
    
    if not channel_data:
        channel_data = [{"label": "No Data", "value": "0%", "raw": 0}]

    return {
        "trajectory": trajectory,
        "channels": channel_data
    }


