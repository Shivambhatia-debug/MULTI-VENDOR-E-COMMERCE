from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class MerchantBase(BaseModel):
    name: str
    email: EmailStr
    status: str = "Active"
    stores: int = 0
    revenue: str = "0 QAR"
    plan: str = "Basic"
    slogan: Optional[str] = None
    coverImage: Optional[str] = None
    rating: float = 0.0
    reviews: int = 0
    category: str

class MerchantCreate(MerchantBase):
    user_id: str

class MerchantInDB(MerchantBase):
    id: str = Field(alias="_id")
    user_id: str
    joined: str

class MerchantOut(MerchantBase):
    id: str
    joined: str
