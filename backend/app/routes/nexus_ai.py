from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time

router = APIRouter(prefix="/api/nexus", tags=["nexus_ai"])

class ChatRequest(BaseModel):
    message: str
    merchant_id: Optional[str] = None
    role: Optional[str] = "customer" # Default to customer, can be 'merchant'
    context: Optional[dict] = None

class AgentResponse(BaseModel):
    agent_id: str
    agent_name: str
    content: str
    action_required: bool = False
    metadata: Optional[dict] = None

# Infrastructure Simulation (Simulated Database Access)
INFRASTRUCTURE_DB = {
    "merchants": [
        {"id": "m1", "name": "Time Stop", "plan": "Enterprise", "branches": 5},
        {"id": "m2", "name": "Nexus Retail", "plan": "Pro", "branches": 2}
    ],
    "products": [
        {"id": "p1", "name": "Omega Watch", "stock": 14, "price": 450},
        {"id": "p2", "name": "Titanium Gear", "stock": 3, "price": 1200}
    ],
    "orders": [
        {"id": "ord_101", "customer": "Alice", "status": "Shipped", "total": 450},
        {"id": "ord_102", "customer": "Bob", "status": "Pending", "total": 1200}
    ]
}

KNOWLEDGE_BASE = {
    "merchant_setup": "Initialize your store via the Command Center > Store Builder. Themes: Minimal (Round), Bold (Square).",
    "customer_help": "You can browse stores in the Marketplace and track orders in your Profile section.",
    "pricing": "Golalita uses a 0% commission model. Enterprise stacks include advanced AI agents.",
}

@router.post("/autonomous-nexus")
@router.post("/autonomous-nexus/")
async def nexus_chat(request: ChatRequest):
    print(f"DEBUG: Nexus Request Received. Role: {request.role}, Msg: {request.message}")
    msg = request.message.lower()
    role = request.role
    
    # Initialize response dict
    response = {
        "agent_id": "strategy_agent",
        "agent_name": "Strategy Agent",
        "content": "Nexus Hub operational. I am coordinating across all backend protocols to assist your current session.",
        "action_required": False,
        "metadata": {"identity_role": role}
    }
    
    # MERCHANT PROTOCOLS
    if role == "merchant":
        if any(word in msg for word in ["stock", "product", "inventory"]):
            p_list = ", ".join([p["name"] for p in INFRASTRUCTURE_DB["products"]])
            response.update({
                "agent_id": "systems_agent",
                "agent_name": "Systems Agent",
                "content": f"Accessing Inventory Database... Current high-value assets identified: {p_list}. Stock levels are within operational parameters.",
                "metadata": {"products": INFRASTRUCTURE_DB["products"]}
            })
        
        elif any(word in msg for word in ["setup", "store", "logo"]):
            response.update({
                "agent_id": "systems_agent",
                "agent_name": "Systems Agent",
                "content": "Merchant Protocol Active. " + KNOWLEDGE_BASE["merchant_setup"],
                "action_required": True
            })

    # CUSTOMER PROTOCOLS
    else:
        if any(word in msg for word in ["order", "track", "my status"]):
            last_order = INFRASTRUCTURE_DB["orders"][0]
            response.update({
                "agent_id": "strategy_agent",
                "agent_name": "Strategy Agent",
                "content": f"Initializing Order Tracking... Order {last_order['id']} for {last_order['customer']} is currently '{last_order['status']}'. Total value: {last_order['total']} QAR.",
                "metadata": {"order": last_order}
            })

    # GENERAL / FALLBACK
    if any(word in msg for word in ["price", "cost", "fee"]):
        response.update({
            "agent_id": "billing_agent",
            "agent_name": "Billing Agent",
            "content": KNOWLEDGE_BASE["pricing"],
            "metadata": {"commission": "0%"}
        })
    
    print(f"DEBUG: Nexus Response Sent. Agent: {response['agent_id']}")
    return response

@router.get("/status")
async def get_agent_status():
    return {
        "systems": "Online",
        "billing": "Online",
        "strategy": "Active",
        "latency": "14ms"
    }
