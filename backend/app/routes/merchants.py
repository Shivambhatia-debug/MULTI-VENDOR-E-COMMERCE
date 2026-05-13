from fastapi import APIRouter, Depends, HTTPException, Body
from app.database import get_database
from app.models.merchant import MerchantOut
from app.models.dashboard_items import (
    BranchCreate, Branch, 
    DriverCreate, Driver, 
    CouponCreate, Coupon,
    RewardBase, LoyaltySettings
)
from app.routes.auth import get_current_user
from typing import List, Optional
from bson import ObjectId

router = APIRouter(prefix="/api/merchants", tags=["merchants"], redirect_slashes=False)

# Helper to convert MongoDB document to response model
def fix_id(doc):
    if doc:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
    return doc

@router.get("/", response_model=List[MerchantOut])
async def list_merchants(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    cursor = db.merchants.find()
    merchants = []
    async for merchant in cursor:
        merchants.append(fix_id(merchant))
    return merchants

@router.get("/me", response_model=MerchantOut)
async def get_my_merchant_profile(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant = await db.merchants.find_one({"user_id": str(current_user["_id"])})
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant profile not found")
    return fix_id(merchant)

# --- BRANCHES ---

@router.get("/branches", response_model=List[dict])
@router.get("/branches/", response_model=List[dict])
async def list_branches(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    cursor = db.branches.find({"merchant_id": merchant_id})
    branches = []
    async for branch in cursor:
        branches.append(fix_id(branch))
    return branches

@router.post("/branches", response_model=dict)
@router.post("/branches/", response_model=dict)
async def create_branch(branch: BranchCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    branch_dict = branch.dict()
    branch_dict["merchant_id"] = str(current_user["_id"])
    result = await db.branches.insert_one(branch_dict)
    return fix_id(branch_dict)

@router.put("/branches/{branch_id}", response_model=dict)
async def update_branch(branch_id: str, branch: BranchCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    result = await db.branches.update_one(
        {"_id": ObjectId(branch_id), "merchant_id": merchant_id},
        {"$set": branch.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Branch not found")
    return {"id": branch_id, **branch.dict()}

@router.delete("/branches/{branch_id}")
async def delete_branch(branch_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    result = await db.branches.delete_one({"_id": ObjectId(branch_id), "merchant_id": merchant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Branch not found")
    return {"message": "Branch deleted"}

# --- DRIVERS ---

@router.get("/drivers/", response_model=List[dict])
@router.get("/drivers", response_model=List[dict])
async def list_drivers(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    cursor = db.drivers.find({"merchant_id": merchant_id})
    drivers = []
    async for driver in cursor:
        drivers.append(fix_id(driver))
    return drivers

@router.post("/drivers/", response_model=dict)
@router.post("/drivers", response_model=dict)
async def create_driver(driver: DriverCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    driver_dict = driver.dict()
    driver_dict["merchant_id"] = str(current_user["_id"])
    result = await db.drivers.insert_one(driver_dict)
    return fix_id(driver_dict)

@router.put("/drivers/{driver_id}", response_model=dict)
async def update_driver(driver_id: str, driver: DriverCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    result = await db.drivers.update_one(
        {"_id": ObjectId(driver_id), "merchant_id": merchant_id},
        {"$set": driver.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"id": driver_id, **driver.dict()}

@router.delete("/drivers/{driver_id}")
async def delete_driver(driver_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    result = await db.drivers.delete_one({"_id": ObjectId(driver_id), "merchant_id": merchant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"message": "Driver deleted"}

# --- COUPONS ---

@router.get("/coupons/", response_model=List[dict])
@router.get("/coupons", response_model=List[dict])
async def list_coupons(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    cursor = db.coupons.find({"merchant_id": merchant_id})
    coupons = []
    async for coupon in cursor:
        coupons.append(fix_id(coupon))
    return coupons

@router.post("/coupons/", response_model=dict)
@router.post("/coupons", response_model=dict)
async def create_coupon(coupon: CouponCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    coupon_dict = coupon.dict()
    coupon_dict["merchant_id"] = str(current_user["_id"])
    result = await db.coupons.insert_one(coupon_dict)
    return fix_id(coupon_dict)

@router.put("/coupons/{coupon_id}", response_model=dict)
async def update_coupon(coupon_id: str, coupon: CouponCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    result = await db.coupons.update_one(
        {"_id": ObjectId(coupon_id), "merchant_id": merchant_id},
        {"$set": coupon.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return {"id": coupon_id, **coupon.dict()}

@router.delete("/coupons/{coupon_id}")
async def delete_coupon(coupon_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    result = await db.coupons.delete_one({"_id": ObjectId(coupon_id), "merchant_id": merchant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return {"message": "Coupon deleted"}

# --- LOYALTY ---

@router.get("/loyalty/", response_model=dict)
@router.get("/loyalty", response_model=dict)
async def get_loyalty_settings(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    settings = await db.loyalty_settings.find_one({"merchant_id": merchant_id})
    if not settings:
        # Default settings
        return {"merchant_id": merchant_id, "points_multiplier": 10.0, "rewards": []}
    return fix_id(settings)

@router.post("/loyalty/", response_model=dict)
@router.post("/loyalty", response_model=dict)
async def update_loyalty_settings(settings: dict = Body(...), current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant_id = str(current_user["_id"])
    # We use replace_one with upsert
    await db.loyalty_settings.replace_one(
        {"merchant_id": merchant_id},
        {"merchant_id": merchant_id, **settings},
        upsert=True
    )
    return {"status": "success", "settings": settings}

