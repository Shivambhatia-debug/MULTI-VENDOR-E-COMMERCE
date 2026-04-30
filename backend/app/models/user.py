from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "merchant"  # merchant or customer
    plan: str = "Basic"

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[str] = Field(alias="_id")
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserOut(UserBase):
    id: str
    created_at: datetime
