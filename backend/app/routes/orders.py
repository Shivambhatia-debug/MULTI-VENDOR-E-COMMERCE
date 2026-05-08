from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_database
from app.models.order import OrderCreate, OrderOut
from app.routes.auth import get_current_user
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/orders", tags=["orders"], redirect_slashes=False)

@router.get("", response_model=List[OrderOut])
@router.get("/", response_model=List[OrderOut])
async def list_orders(type: Optional[str] = "sales", current_user: dict = Depends(get_current_user)):
    db = await get_database()
    query = {}
    
    if current_user["role"] == "admin":
        pass # Admin sees everything
    elif current_user["role"] == "merchant":
        if type == "purchases":
            query["customer_email"] = current_user["email"]
        else:
            query["merchant_id"] = str(current_user["_id"])
    else:
        query["customer_email"] = current_user["email"]
    
    cursor = db.orders.find(query).sort("date", -1)
    orders = []
    async for order in cursor:
        order["id"] = str(order["_id"])
        order.pop("_id", None)
        orders.append(order)
    return orders

@router.post("", response_model=OrderOut)
@router.post("/", response_model=OrderOut)
async def create_order(order_in: OrderCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    order_dict = order_in.dict()
    order_dict["date"] = datetime.utcnow()
    result = await db.orders.insert_one(order_dict)
    order_dict["id"] = str(result.inserted_id)
    return order_dict

@router.patch("/{id}/status", response_model=OrderOut)
async def update_order_status(id: str, status: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    result = await db.orders.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": {"status": status}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    result["id"] = str(result["_id"])
    result.pop("_id", None)
    return result

@router.patch("/{id}", response_model=OrderOut)
async def update_order(id: str, updates: dict, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    # Ensure only valid fields are updated
    valid_fields = ["status", "tracking_id", "delivery_estimate", "shipping_address", "city", "zip_code"]
    update_data = {k: v for k, v in updates.items() if k in valid_fields}
    
    result = await db.orders.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    result["id"] = str(result["_id"])
    result.pop("_id", None)
    return result
