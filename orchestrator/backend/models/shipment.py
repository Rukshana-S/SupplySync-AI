from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ShipmentCreate(BaseModel):
    pickupLocation: str
    dropLocation: str
    cargoType: str
    cargoWeight: float
    vehicleType: str

class ShipmentUpdate(BaseModel):
    status: Optional[str] = None
    assignedDriverId: Optional[str] = None
    assignedDriverName: Optional[str] = None
    assignedVehicleNumber: Optional[str] = None
    assignedVehicleType: Optional[str] = None

class ShipmentResponse(BaseModel):
    id: str = Field(alias="_id")
    shipperId: str
    pickupLocation: str
    dropLocation: str
    cargoType: str
    cargoWeight: float
    vehicleType: str
    estimatedPrice: float
    status: str
    assignedDriverId: Optional[str] = None
    assignedDriverName: Optional[str] = None
    assignedVehicleNumber: Optional[str] = None
    assignedVehicleType: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    topRecommendations: Optional[List[Dict[str, Any]]] = None
    otherDrivers: Optional[List[Dict[str, Any]]] = None
    routeData: Optional[Dict[str, Any]] = None
    simulationData: Optional[Dict[str, Any]] = None
    etaData: Optional[Dict[str, Any]] = None
    riskData: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True
