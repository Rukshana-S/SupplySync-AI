import os
import sys
import json
import asyncio
import bcrypt
import traceback
from pymongo import MongoClient

# Setup paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from core.config import settings

def get_password_hash(password: str) -> str:
    # Hash and decode to store as string
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def main():
    print("------------------------------------")
    print("Starting Driver Import Process")
    print("------------------------------------")
    
    json_path = os.path.join(BASE_DIR, "..", "..", "driver-agent", "backend", "drivers_200.json")
    if not os.path.exists(json_path):
        print(f"Error: Could not find dataset at {json_path}")
        return

    # Load JSON
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            drivers_data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        return
        
    total_drivers = len(drivers_data)
    
    # Connect to MongoDB
    try:
        client = MongoClient(settings.MONGODB_URI)
        db = client[settings.DATABASE_NAME]
        collection = db["drivers"]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return

    # Pre-compute password hash for efficiency (since they all get the same default password)
    hashed_password = get_password_hash("123456")
    
    inserted_count = 0
    skipped_count = 0
    error_count = 0
    
    # Track assigned driver IDs to ensure uniqueness
    generated_id_counter = 1
    
    for driver in drivers_data:
        try:
            email = driver.get("email")
            license_number = driver.get("license_number")
            
            if not email:
                print(f"Skipping driver without email: {driver}")
                skipped_count += 1
                continue
                
            # Check for duplicates using email or license number
            existing = collection.find_one({"$or": [{"email": email}, {"license_number": license_number}]})
            if existing:
                skipped_count += 1
                continue
            
            # Use driver_id from JSON, or generate one
            driver_id = driver.get("driver_id")
            if not driver_id:
                # Generate unique ID
                while True:
                    candidate_id = f"DRV{generated_id_counter:04d}"
                    generated_id_counter += 1
                    if not collection.find_one({"driver_id": candidate_id}):
                        driver_id = candidate_id
                        break
            
            # Map JSON fields to our application schema and append required verification fields
            mapped_driver = {
                "driver_id": driver_id,
                "full_name": driver.get("name"),
                "email": email,
                "phone_number": driver.get("phone", ""),
                "age": driver.get("age", 0),
                "gender": driver.get("gender"),
                "license_number": license_number,
                "vehicle_type": driver.get("vehicle_type"),
                "vehicle_number": driver.get("vehicle_number"),
                "vehicle_capacity": driver.get("capacity_kg", 0) / 1000.0, # Convert kg to tons for consistency
                "current_location": driver.get("current_city"),
                "experience_years": driver.get("experience_years", 0),
                "rating": driver.get("rating", 5.0),
                "completed_trips": driver.get("completed_trips", 0),
                
                # Authentication & Verification
                "hashed_password": hashed_password,
                "status": "AVAILABLE",
                "availability": True,
                "verified": True,
                "documentVerified": True,
                "verificationStatus": "Verified",
                "approvalStatus": "Approved",
                "dl_verification": "mock_dl_verified_123",
                "rc_verification": "mock_rc_verified_123",
            }
            
            collection.insert_one(mapped_driver)
            inserted_count += 1
            
        except Exception as e:
            error_count += 1
            print(f"Error processing driver {driver.get('email', 'Unknown')}: {e}")
            traceback.print_exc()

    print("\n------------------------------------")
    print("Driver Import Summary")
    print("------------------------------------")
    print(f"JSON Drivers : {total_drivers}")
    print(f"Inserted     : {inserted_count}")
    print(f"Skipped      : {skipped_count}")
    print(f"Errors       : {error_count}")
    print("------------------------------------")
    
if __name__ == "__main__":
    main()
