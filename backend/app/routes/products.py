from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_database
from app.models.product import ProductCreate, ProductOut, ProductUpdate
from app.routes.auth import get_current_user
from bson import ObjectId
from typing import List, Optional

router = APIRouter(prefix="/api/products", tags=["products"], redirect_slashes=False)

@router.get("", response_model=List[ProductOut])
@router.get("/", response_model=List[ProductOut])
async def list_products(category: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    query = {"merchant_id": str(current_user["_id"])}
    if category:
        query["category"] = category
    
    cursor = db.products.find(query)
    products = []
    async for product in cursor:
        product["id"] = str(product["_id"])
        product.pop("_id", None)
        products.append(product)
    return products

@router.post("", response_model=ProductOut)
@router.post("/", response_model=ProductOut)
async def create_product(product_in: ProductCreate, current_user: dict = Depends(get_current_user)):
    print(f"DEBUG: Receiving product creation request from user {current_user['email']}")
    print(f"DEBUG: Payload Name: {product_in.name}, Image size: {len(product_in.image) if product_in.image else 0}")
    if current_user["role"] != "merchant":
        raise HTTPException(status_code=403, detail="Only merchants can create products")
    
    db = await get_database()
    product_dict = product_in.dict()
    product_dict["merchant_id"] = str(current_user["_id"])
    
    result = await db.products.insert_one(product_dict)
    product_dict["id"] = str(result.inserted_id)
    product_dict.pop("_id", None)
    return product_dict

@router.get("/{id}", response_model=ProductOut)
async def get_product(id: str):
    db = await get_database()
    product = await db.products.find_one({"_id": ObjectId(id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product["id"] = str(product["_id"])
    product.pop("_id", None)
    return product

@router.put("/{id}", response_model=ProductOut)
async def update_product(id: str, product_in: ProductUpdate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    # Check ownership link could be added here if merchant_id is used
    update_data = {k: v for k, v in product_in.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.products.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    result["id"] = str(result["_id"])
    result.pop("_id", None)
    return result

@router.delete("/{id}")
async def delete_product(id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    result = await db.products.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
