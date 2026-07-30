from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class DriverCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone_number: str
    age: int
    vehicle_type: str
    vehicle_capacity: float
    current_location: str

class DriverInDB(BaseModel):
    id: str = Field(alias="_id")
    full_name: str
    email: str
    hashed_password: str
    phone_number: str
    age: int
    vehicle_type: str
    vehicle_capacity: float
    current_location: str
    status: str = "AVAILABLE"
    availability: bool = True
    rc_book_verification: Optional[dict] = None
    driving_license_verification: Optional[dict] = None

class DriverResponse(BaseModel):
    id: str
    full_name: str
    email: str
    status: str
    availability: bool
    vehicle_type: str
