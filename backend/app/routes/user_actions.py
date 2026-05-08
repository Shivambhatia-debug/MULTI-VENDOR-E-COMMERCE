from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_database
from app.routes.auth import get_current_user
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/api/user", tags=["user-actions"])

class CartItemIn(BaseModel):
    product_id: str
    quantity: int = 1

@router.get("/cart")
@router.get("/cart/")
async def get_cart(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user = await db.users.find_one({"_id": current_user["_id"]})
    if not user:
        return []
    cart_items = user.get("cart", [])
    
    # Enrich with product details
    enriched_cart = []
    for item in cart_items:
        product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
        if product:
            product["id"] = str(product["_id"])
            product.pop("_id", None)
            enriched_cart.append({
                "product": product,
                "quantity": item["quantity"]
            })
    return enriched_cart

@router.post("/cart")
@router.post("/cart/")
async def add_to_cart(item_in: CartItemIn, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    
    # Check if product exists
    product = await db.products.find_one({"_id": ObjectId(item_in.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    user = await db.users.find_one({"_id": current_user["_id"]})
    cart = user.get("cart", [])
    
    # Update quantity if product already in cart
    found = False
    for item in cart:
        if item["product_id"] == item_in.product_id:
            item["quantity"] = item_in.quantity
            found = True
            break
            
    if not found:
        cart.append({"product_id": item_in.product_id, "quantity": item_in.quantity})
        
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"cart": cart}}
    )
    return {"message": "Cart updated", "cart": cart}

@router.delete("/cart/{product_id}")
async def remove_from_cart(product_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user = await db.users.find_one({"_id": current_user["_id"]})
    cart = user.get("cart", [])
    
    new_cart = [item for item in cart if item["product_id"] != product_id]
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"cart": new_cart}}
    )
    return {"message": "Item removed from cart"}

@router.get("/wishlist")
@router.get("/wishlist/")
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user = await db.users.find_one({"_id": current_user["_id"]})
    if not user:
        return []
    wishlist_ids = user.get("wishlist", [])
    
    enriched_wishlist = []
    for pid in wishlist_ids:
        product = await db.products.find_one({"_id": ObjectId(pid)})
        if product:
            product["id"] = str(product["_id"])
            product.pop("_id", None)
            enriched_wishlist.append(product)
    return enriched_wishlist

@router.post("/wishlist/{product_id}")
async def toggle_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    
    # Check if product exists
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    user = await db.users.find_one({"_id": current_user["_id"]})
    wishlist = user.get("wishlist", [])
    
    if product_id in wishlist:
        wishlist.remove(product_id)
        action = "removed"
    else:
        wishlist.append(product_id)
        action = "added"
        
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"wishlist": wishlist}}
    )
    return {"message": f"Product {action} from wishlist", "wishlist": wishlist}
