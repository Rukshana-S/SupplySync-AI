from fastapi import APIRouter, Depends, HTTPException
from typing import List
from db.session import get_database
from api.deps import get_current_user
from models.shipment import ShipmentCreate, ShipmentUpdate
import datetime
from bson import ObjectId
from services.ai_services import (
    get_driver_recommendations,
    get_best_route,
    simulate_route,
    predict_eta,
    evaluate_risk
)

router = APIRouter()

def serialize_shipment(shipment):
    shipment["_id"] = str(shipment["_id"])
    return shipment

@router.post("/create")
async def create_shipment(shipment: ShipmentCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "shipper":
        raise HTTPException(status_code=403, detail="Only shippers can create shipments")
        
    db = get_database()
    
    import uuid
    
    shipment_dict = shipment.dict()
    shipment_dict["shipmentId"] = f"SHP{str(uuid.uuid4().hex)[:8].upper()}"
    shipment_dict["shipperId"] = str(current_user["_id"])
    shipment_dict["status"] = "Created"
    shipment_dict["assignedDriverId"] = None
    shipment_dict["assignedDriverName"] = None
    shipment_dict["createdAt"] = datetime.datetime.utcnow()
    shipment_dict["updatedAt"] = datetime.datetime.utcnow()
    
    top_recommendations = []
    other_drivers = []
    
    # Optional: fetch driver recommendations right away
    rec_result = await get_driver_recommendations(shipment_dict)
    if rec_result["success"]:
        data = rec_result.get("data", {})
        top_recommendations = data.get("topRecommendations", [])
        other_drivers = data.get("otherDrivers", [])
        shipment_dict["topRecommendations"] = top_recommendations
        shipment_dict["otherDrivers"] = other_drivers
        
    result = await db["shipments"].insert_one(shipment_dict)
    
    return {
        "message": "Shipment created", 
        "id": str(result.inserted_id),
        "topRecommendations": top_recommendations,
        "otherDrivers": other_drivers
    }


@router.get("/")
async def get_shipments(current_user: dict = Depends(get_current_user)):
    db = get_database()
    
    if current_user["role"] == "shipper":
        cursor = db["shipments"].find({"shipperId": str(current_user["_id"])})
    elif current_user["role"] == "driver":
        # Check both the custom driver_id and the default _id just in case
        driver_filter = {"$or": [
            {"assignedDriverId": str(current_user["_id"])},
            {"assignedDriverId": current_user.get("driver_id")}
        ]}
        cursor = db["shipments"].find(driver_filter)
    else:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    shipments = await cursor.to_list(length=100)
    return {"success": True, "data": [serialize_shipment(s) for s in shipments]}


@router.get("/{shipment_id}")
async def get_shipment(shipment_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    shipment = await db["shipments"].find_one({"_id": ObjectId(shipment_id)})
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
        
    return {"success": True, "data": serialize_shipment(shipment)}


@router.put("/{shipment_id}")
async def update_shipment(shipment_id: str, update_data: ShipmentUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updatedAt"] = datetime.datetime.utcnow()
    
    result = await db["shipments"].update_one(
        {"_id": ObjectId(shipment_id)}, 
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Update failed")
        
    return {"success": True, "message": "Shipment updated"}


@router.delete("/{shipment_id}")
async def delete_shipment(shipment_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "shipper":
        raise HTTPException(status_code=403, detail="Only shippers can delete shipments")
        
    db = get_database()
    result = await db["shipments"].delete_one({"_id": ObjectId(shipment_id), "shipperId": str(current_user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Shipment not found or unauthorized")
        
    return {"success": True, "message": "Shipment deleted"}


@router.post("/{shipment_id}/assign-driver")
async def assign_driver(shipment_id: str, payload: dict, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "shipper":
        raise HTTPException(status_code=403, detail="Only shippers can assign drivers")
        
    driver_id = payload.get("driverId")
    driver_name = payload.get("driverName", "Unknown Driver")
    vehicle_number = payload.get("vehicleNumber")
    vehicle_type = payload.get("vehicleType")
    
    if not driver_id:
        raise HTTPException(status_code=400, detail="driverId required")
        
    db = get_database()
    result = await db["shipments"].update_one(
        {"_id": ObjectId(shipment_id), "shipperId": str(current_user["_id"])},
        {"$set": {
            "assignedDriverId": driver_id,
            "assignedDriverName": driver_name,
            "assignedVehicleNumber": vehicle_number,
            "assignedVehicleType": vehicle_type,
            "status": "Driver Assigned",
            "updatedAt": datetime.datetime.utcnow()
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Shipment not found")
        
    return {"success": True, "message": "Driver assigned"}


@router.post("/{shipment_id}/accept")
async def accept_shipment(shipment_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can accept shipments")
        
    db = get_database()
    
    driver_filter = {"$or": [
        {"assignedDriverId": str(current_user["_id"])},
        {"assignedDriverId": current_user.get("driver_id")}
    ]}
    
    shipment = await db["shipments"].find_one({"_id": ObjectId(shipment_id), **driver_filter})
    
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
        
    # Trigger Multi-Agent Pipeline
    pickup = shipment.get("pickupLocation", "Unknown")
    drop = shipment.get("dropLocation", "Unknown")
    
    # 1. Route Agent
    route_resp = await get_best_route(pickup, drop)
    route_data = route_resp.get("data", {}) if route_resp["success"] else None
    
    sim_data = None
    eta_data = None
    risk_data = None
    
    if route_data:
        # 2. Simulation Agent
        sim_resp = await simulate_route(route_data)
        sim_data = sim_resp.get("data", {}) if sim_resp["success"] else None
        
        # 3. ETA Agent
        eta_resp = await predict_eta(route_data)
        eta_data = eta_resp.get("data", {}) if eta_resp["success"] else None
        
        # 4. Risk Agent
        risk_resp = await evaluate_risk(route_data)
        risk_data = risk_resp.get("data", {}) if risk_resp["success"] else None

    # Update Shipment
    await db["shipments"].update_one(
        {"_id": ObjectId(shipment_id)},
        {"$set": {
            "status": "In Transit",
            "routeData": route_data,
            "simulationData": sim_data,
            "etaData": eta_data,
            "riskData": risk_data,
            "updatedAt": datetime.datetime.utcnow()
        }}
    )
    
    return {"success": True, "message": "Shipment accepted and AI pipeline executed"}


@router.post("/{shipment_id}/reject")
async def reject_shipment(shipment_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can reject shipments")
        
    db = get_database()
    
    driver_filter = {"$or": [
        {"assignedDriverId": str(current_user["_id"])},
        {"assignedDriverId": current_user.get("driver_id")}
    ]}
    
    result = await db["shipments"].update_one(
        {"_id": ObjectId(shipment_id), **driver_filter},
        {"$set": {
            "assignedDriverId": None,
            "assignedDriverName": None,
            "status": "Created",
            "updatedAt": datetime.datetime.utcnow()
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Shipment not found")
        
    return {"success": True, "message": "Shipment rejected"}

