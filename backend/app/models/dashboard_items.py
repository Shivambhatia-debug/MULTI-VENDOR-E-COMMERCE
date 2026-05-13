from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class BranchBase(BaseModel):
    name: str
    city: str
    address: str
    phone: str
    hours: str
    status: str = "Active"

class BranchCreate(BranchBase):
    pass

class Branch(BranchBase):
    id: str
    merchant_id: str

class DriverBase(BaseModel):
    name: str
    phone: str
    vehicle: str
    status: str = "Active"

class DriverCreate(DriverBase):
    pass

class Driver(DriverBase):
    id: str
    merchant_id: str

class CouponBase(BaseModel):
    code: str
    type: str # "fixed" or "percentage"
    value: float
    usage: int = 0
    expiry: Optional[str] = None
    status: str = "Active"

class CouponCreate(CouponBase):
    pass

class Coupon(CouponBase):
    id: str
    merchant_id: str

class RewardBase(BaseModel):
    name: str
    points_required: int
    discount_value: float
    status: str = "Active"

class LoyaltySettings(BaseModel):
    points_multiplier: float = 10.0 # e.g., 1 QAR = 10 points
    rewards: List[RewardBase] = []
