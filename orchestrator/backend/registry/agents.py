from pydantic import BaseModel
from typing import Dict, List

class AgentConfig(BaseModel):
    name: str
    base_url: str
    health_endpoint: str
    status: str

# Placeholder registry
agent_registry: Dict[str, AgentConfig] = {
    "document_verification": AgentConfig(
        name="Document Verification Agent",
        base_url="http://127.0.0.1:8001",
        health_endpoint="/health",
        status="unknown"
    ),
    "driver_recommendation": AgentConfig(
        name="Driver Recommendation Agent",
        base_url="http://127.0.0.1:8002",
        health_endpoint="/health",
        status="unknown"
    ),
    "shipment_recommendation": AgentConfig(
        name="Shipment Recommendation Agent",
        base_url="http://127.0.0.1:8003",
        health_endpoint="/health",
        status="unknown"
    ),
    "route_recommendation": AgentConfig(
        name="Route Recommendation Agent",
        base_url="http://127.0.0.1:8004",
        health_endpoint="/health",
        status="unknown"
    ),
    "route_simulation": AgentConfig(
        name="Route Simulation Agent",
        base_url="http://127.0.0.1:8005",
        health_endpoint="/health",
        status="unknown"
    ),
    "eta_prediction": AgentConfig(
        name="ETA Prediction Agent",
        base_url="http://127.0.0.1:8006",
        health_endpoint="/health",
        status="unknown"
    ),
    "risk_prediction": AgentConfig(
        name="Risk Prediction Agent",
        base_url="http://127.0.0.1:8007",
        health_endpoint="/health",
        status="unknown"
    ),
    "logistics_insights": AgentConfig(
        name="Logistics Insights Agent",
        base_url="http://127.0.0.1:8008",
        health_endpoint="/health",
        status="unknown"
    ),
}

def get_agent_registry() -> Dict[str, AgentConfig]:
    return agent_registry
