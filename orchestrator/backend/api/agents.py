from fastapi import APIRouter
import httpx
import asyncio
from registry.agents import get_agent_registry

router = APIRouter()

@router.get("/status")
async def get_agents_status():
    registry = get_agent_registry()
    agents = list(registry.values())
    
    async def check_health(agent):
        try:
            # We assume agent.base_url + agent.health_endpoint is the full health URL
            url = f"{agent.base_url.rstrip('/')}{agent.health_endpoint}"
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    return {**agent.dict(), "status": "Healthy"}
                else:
                    return {**agent.dict(), "status": "Disconnected"}
        except Exception:
            return {**agent.dict(), "status": "Offline"}

    results = await asyncio.gather(*(check_health(agent) for agent in agents))
    
    return {"success": True, "data": results}
