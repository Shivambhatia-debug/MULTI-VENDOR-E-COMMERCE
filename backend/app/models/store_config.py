from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class StoreConfigBase(BaseModel):
    store_name: str = "My Store"
    logo_url: Optional[str] = None
    primary_color: str = "#2563eb"
    bg_color: str = "#ffffff"
    text_color: str = "#0f172a"
    accent_color: str = "#3b82f6"
    banner_title: str = "WELCOME TO OUR STORE"
    banner_subtitle: str = "Premium products for modern lifestyle."
    banner_btn: str = "Shop Now"
    hero_image: str = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
    hero_layout: str = "split"
    ticker_text: str = "⚡ FREE SHIPPING ON ALL ORDERS ⚡"
    ticker_color: str = "#2563eb"
    show_ticker: bool = True
    discovery_title: str = "New Arrivals"
    discovery_subtitle: str = "Curated essentials for the modern lifestyle."
    subdomain: str = ""
    custom_domain: Optional[str] = None
    ssl_status: str = "none"  # none | provisioning | active
    domain_status: str = "none"  # none | pending_dns | dns_verified | deploying | active | failed
    dns_records: List[Dict] = []
    domain_submitted_at: Optional[str] = None
    domain_verified_at: Optional[str] = None
    domain_rejection_reason: Optional[str] = None
    vercel_domain_id: Optional[str] = None
    is_published: bool = False
    hero_library: List[str] = []

class StoreConfigUpdate(StoreConfigBase):
    pass

class DomainUpdate(BaseModel):
    custom_domain: Optional[str] = None
    subdomain: Optional[str] = None

class StoreConfigOut(StoreConfigBase):
    id: str
    merchant_id: str
    merchant_name: Optional[str] = None
    merchant_category: Optional[str] = None
    merchant_rating: Optional[float] = 0.0
    merchant_reviews: Optional[int] = 0
    cover_image: Optional[str] = None
    updated_at: Optional[str] = None

