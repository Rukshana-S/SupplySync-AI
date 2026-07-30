import requests

url = "http://localhost:8000/api/shipments/create"

# I need an auth token to hit the orchestrator create shipment endpoint, or I can just check the code.
# Let's check `orchestrator/backend/api/shipments.py`
