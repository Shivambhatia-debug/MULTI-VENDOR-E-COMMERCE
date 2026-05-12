from pydantic import BaseModel, Field
from typing import Optional, List

class ProductBase(BaseModel):
    name: str
    price: float
    originalPrice: Optional[float] = None
    description: str
    category: str
    image: str = ""
    images: List[str] = []
    rating: float = 0.0
    reviews: int = 0
    sku: str = "N/A"
    status: str = "Active"
    stock: int = 0
    merchantName: Optional[str] = None
    merchantRating: Optional[float] = None
    deliveryTime: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    status: Optional[str] = None
    stock: Optional[int] = None

class ProductInDB(ProductBase):
    id: str = Field(alias="_id")
    merchant_id: str

class ProductOut(ProductBase):
    id: str
    merchant_id: str
