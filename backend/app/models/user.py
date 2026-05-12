from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str = "merchant"  # merchant, admin, or customer
    plan: str = "Basic"
    subscription_status: str = "none"
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    subscription_paid_at: Optional[datetime] = None
    store_slug: Optional[str] = None
    custom_domain: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[str] = Field(alias="_id")
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserOut(UserBase):
    id: str
    created_at: datetime
    subscription_status: str
    trial_end: Optional[datetime] = None
    subscription_paid_at: Optional[datetime] = None
