import requests

url = "http://127.0.0.1:8000/api/shipments/create"
headers = {
    "Content-Type": "application/json",
    # Just need a fake token if auth is enforced, or I can just hit the driver agent directly.
}

payload = {
    "pickupLocation": "Erode",
    "dropLocation": "Chennai",
    "cargoType": "Test",
    "cargoWeight": 5.0,
    "vehicleType": "Truck"
}

# Let's hit the driver agent directly to avoid auth issues for debugging
agent_url = "http://127.0.0.1:8002/recommend-driver"

response = requests.post(agent_url, json=payload)
print("Status Code:", response.status_code)
try:
    print(response.json())
except:
    print(response.text)
