import os
import json
from pymongo import MongoClient

# Database connection
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "orchestrator", "backend", ".env"))

MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    # Try driver-agent env
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
    MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["SupplySyncAI"]
drivers_collection = db["drivers"]

# 1. Update MongoDB
print("Updating MongoDB drivers collection...")
result = drivers_collection.update_many(
    {}, 
    {"$set": {
        "verification_status": "Verified",
        "verificationStatus": "Verified" # Add camelCase too just in case
    }}
)
print(f"MongoDB Update Complete. Modified {result.modified_count} documents.")

# 2. Update JSON file
print("Updating drivers_200.json...")
json_path = os.path.join(os.path.dirname(__file__), "drivers_200.json")

with open(json_path, 'r', encoding='utf-8') as f:
    drivers_data = json.load(f)

for driver in drivers_data:
    driver["verification_status"] = "Verified"
    driver["verificationStatus"] = "Verified"

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(drivers_data, f, indent=4)

print("JSON file updated successfully.")
