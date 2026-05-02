from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    items: int
    total: str
    status: str = "Processing"
    method: str = "Online"

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
