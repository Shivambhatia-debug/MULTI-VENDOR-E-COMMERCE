from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    items: int
    items_details: Optional[List[dict]] = None
    total: str
    status: str = "Processing"
    method: str = "Online"
    tracking_id: Optional[str] = None
    delivery_estimate: Optional[str] = None

class OrderCreate(OrderBase):
    merchant_id: str

class OrderInDB(OrderBase):
    id: str = Field(alias="_id")
    date: datetime = Field(default_factory=datetime.utcnow)
    merchant_id: str

class OrderOut(OrderBase):
    id: str
    date: datetime
    merchant_id: str
