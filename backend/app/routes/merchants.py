from fastapi import APIRouter, Depends, HTTPException
from ..database import get_database
from ..models.merchant import MerchantOut
from .auth import get_current_user
from typing import List

router = APIRouter(prefix="/api/merchants", tags=["merchants"])

@router.get("/", response_model=List[MerchantOut])
async def list_merchants(current_user: dict = Depends(get_current_user)):
    # This might be restricted to Admin users in a real app
    db = await get_database()
    cursor = db.merchants.find()
    merchants = []
    async for merchant in cursor:
        merchant["id"] = str(merchant["_id"])
        merchants.append(merchant)
    return merchants

@router.get("/me", response_model=MerchantOut)
async def get_my_merchant_profile(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    merchant = await db.merchants.find_one({"user_id": str(current_user["_id"])})
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant profile not found")
    merchant["id"] = str(merchant["_id"])
    return merchant
