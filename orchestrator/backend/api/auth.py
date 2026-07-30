import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from db.session import get_database
from core.security import get_password_hash, verify_password, create_access_token
from services.agent_service import verify_document
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

class ShipperRegistration(BaseModel):
    full_name: str
    organization_name: str
    email: EmailStr
    password: str
    phone_number: str
    organization_address: str

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str # "driver" or "shipper"

@router.post("/register-driver")
async def register_driver(
    full_name: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(...),
    phone_number: str = Form(...),
    age: int = Form(...),
    vehicle_type: str = Form(...),
    vehicle_capacity: float = Form(...),
    current_location: str = Form(...),
    rc_book: UploadFile = File(...),
    driving_license: UploadFile = File(...)
):
    db = get_database()
    
    # Check if user already exists
    existing_driver = await db["drivers"].find_one({"email": email})
    if existing_driver:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Call document verification agent for Driving License
    dl_result = await verify_document(driving_license, "driving_license")
    if not dl_result.get("success"):
        raise HTTPException(status_code=400, detail=f"Driving License Verification Failed: {dl_result.get('message', 'Unknown Error')}")

    # Call document verification agent for RC Book
    rc_result = await verify_document(rc_book, "rc_book")
    if not rc_result.get("success"):
        raise HTTPException(status_code=400, detail=f"RC Book Verification Failed: {rc_result.get('message', 'Unknown Error')}")

    driver_data = {
        "full_name": full_name,
        "email": email,
        "hashed_password": get_password_hash(password),
        "phone_number": phone_number,
        "age": age,
        "vehicle_type": vehicle_type,
        "vehicle_capacity": vehicle_capacity,
        "current_location": current_location,
        "status": "AVAILABLE",
        "availability": True,
        "dl_verification": dl_result.get("verificationId"),
        "rc_verification": rc_result.get("verificationId")
    }

    result = await db["drivers"].insert_one(driver_data)
    
    return {"message": "Driver registered successfully", "id": str(result.inserted_id)}


@router.post("/register-shipper")
async def register_shipper(shipper: ShipperRegistration):
    db = get_database()
    
    existing_shipper = await db["shippers"].find_one({"email": shipper.email})
    if existing_shipper:
        raise HTTPException(status_code=400, detail="Email already registered")

    shipper_data = shipper.dict()
    shipper_data["hashed_password"] = get_password_hash(shipper_data.pop("password"))

    result = await db["shippers"].insert_one(shipper_data)
    
    return {"message": "Shipper registered successfully", "id": str(result.inserted_id)}


@router.post("/login")
async def login(credentials: LoginRequest):
    db = get_database()
    
    if credentials.role == "driver":
        user = await db["drivers"].find_one({"email": credentials.email})
    elif credentials.role == "shipper":
        user = await db["shippers"].find_one({"email": credentials.email})
    else:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user["email"], "role": credentials.role})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "role": credentials.role
        }
    }
