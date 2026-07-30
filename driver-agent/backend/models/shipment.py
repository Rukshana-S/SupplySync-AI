from pydantic import BaseModel

class Shipment(BaseModel):

    pickupLocation: str
    dropLocation: str
    cargoType: str
    cargoWeight: float
    vehicleType: str