import httpx
import logging
from registry.agents import get_agent_registry

logger = logging.getLogger(__name__)

async def _call_agent(agent_key: str, endpoint: str, method: str = "POST", payload: dict = None) -> dict:
    """Helper method to call an agent safely with error handling and timeouts."""
    registry = get_agent_registry()
    agent = registry.get(agent_key)
    
    if not agent:
        logger.error(f"Agent {agent_key} not found in registry.")
        return {"success": False, "message": f"{agent_key} is temporarily unavailable"}
        
    url = f"{agent.base_url}{endpoint}"
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == "POST":
                response = await client.post(url, json=payload)
            elif method == "GET":
                response = await client.get(url, params=payload)
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                logger.error(f"{agent_key} failed: {response.status_code} - {response.text}")
                return {"success": False, "message": f"Agent returned status {response.status_code}"}
    except httpx.ConnectError:
        logger.error(f"Connection Error: {agent_key} at {url} is down.")
        return {"success": False, "message": "Agent temporarily unavailable"}
    except Exception as e:
        logger.exception(f"Exception calling {agent_key} at {url}")
        return {"success": False, "message": "Agent temporarily unavailable"}


async def get_driver_recommendations(shipment_data: dict) -> dict:
    # Send shipment details to get recommended drivers
    import json
    # Convert any datetimes to strings to avoid JSON serialization errors
    safe_data = json.loads(json.dumps(shipment_data, default=str))
    
    # Wait, the endpoint is actually `/recommend-driver` NOT `/recommend-drivers`
    return await _call_agent("driver_recommendation", "/recommend-driver", "POST", safe_data)


async def get_best_route(pickup: str, drop: str) -> dict:
    payload = {"source": pickup, "destination": drop}
    return await _call_agent("route_recommendation", "/generate-route", "POST", payload)


async def simulate_route(route_data: dict) -> dict:
    return await _call_agent("route_simulation", "/simulate", "POST", route_data)


async def predict_eta(route_data: dict) -> dict:
    return await _call_agent("eta_prediction", "/predict", "POST", route_data)


async def evaluate_risk(route_data: dict) -> dict:
    return await _call_agent("risk_prediction", "/evaluate", "POST", route_data)

