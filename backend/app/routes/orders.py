from fastapi import APIRouter, Depends, HTTPException
from ..database import get_database
from ..models.order import OrderCreate, OrderOut
from .auth import get_current_user
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api/orders", tags=["orders"], redirect_slashes=False)

@router.get("", response_model=List[OrderOut])
@router.get("/", response_model=List[OrderOut])
async def list_orders(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    query = {}
    if current_user["role"] == "merchant":
        query["merchant_id"] = str(current_user["_id"])
    
    cursor = db.orders.find(query)
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
    result = await db.orders.insert_one(order_dict)
    order_dict["id"] = str(result.inserted_id)
    order_dict.pop("_id", None)
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
