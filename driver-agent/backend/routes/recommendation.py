from fastapi import APIRouter
from models.shipment import Shipment
from services.driver_filter import filter_drivers

router = APIRouter()

def format_driver(d, rank=None):
    res = {
        "driverId": d.get("driver_id"),
        "driverName": d.get("full_name"),
        "currentCity": d.get("current_location"),
        "experienceYears": d.get("experience_years", 0),
        "completedTrips": d.get("completed_trips", 0),
        "overallRating": d.get("rating", 0.0),
        "onTimePercentage": d.get("on_time_percentage", 0),
        "safetyScore": d.get("safety_score", 0),
        "recommendationScore": d.get("recommendationScore", 0.0),
        "availability": d.get("availability", True),
        "email": d.get("email"),
        "phone": d.get("phone_number"),
        "vehicleType": d.get("vehicle_type"),
        "vehicleNumber": d.get("vehicle_number"),
        "capacity": d.get("vehicle_capacity", 0) * 1000
    }
    
    if rank is not None:
        res["rank"] = rank
        res["aiReason"] = d.get("aiReason", "")
        
    return res

@router.post("/recommend-driver")
def recommend_driver(shipment: Shipment):
    top_3, others = filter_drivers(shipment)

    # Format the response exactly as requested
    response = {
        "pickupLocation": shipment.pickupLocation,
        "topRecommendations": [format_driver(d, i + 1) for i, d in enumerate(top_3)],
        "otherDrivers": [format_driver(d) for d in others]
    }
    
    return response