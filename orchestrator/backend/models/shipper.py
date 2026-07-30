from pydantic import BaseModel, EmailStr, Field

class ShipperCreate(BaseModel):
    full_name: str
    organization_name: str
    email: EmailStr
    password: str
    phone_number: str
    organization_address: str

class ShipperInDB(BaseModel):
    id: str = Field(alias="_id")
    full_name: str
    organization_name: str
    email: str
    hashed_password: str
    phone_number: str
    organization_address: str

class ShipperResponse(BaseModel):
    id: str
    full_name: str
    email: str
    organization_name: str
