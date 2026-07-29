from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class DriverRegistration(BaseModel):
    email: str
    password: str
    name: str

class ShipperRegistration(BaseModel):
    email: str
    password: str
    company_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register-driver")
async def register_driver(driver: DriverRegistration):
    return {"message": "Driver registered successfully (Placeholder)", "data": driver.dict(exclude={"password"})}

@router.post("/register-shipper")
async def register_shipper(shipper: ShipperRegistration):
    return {"message": "Shipper registered successfully (Placeholder)", "data": shipper.dict(exclude={"password"})}

@router.post("/login")
async def login(credentials: LoginRequest):
    return {"message": "Login successful (Placeholder)", "access_token": "placeholder_token", "token_type": "bearer"}
