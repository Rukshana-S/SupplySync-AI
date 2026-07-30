from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from typing import Optional

from core.config import settings
from db.session import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    db = get_database()
    
    if role == "driver":
        user = await db["drivers"].find_one({"email": user_id})
    elif role == "shipper":
        user = await db["shippers"].find_one({"email": user_id})
    else:
        raise credentials_exception
        
    if user is None:
        raise credentials_exception
    
    user["_id"] = str(user["_id"])
    user["role"] = role
    return user

async def get_current_driver(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "driver":
        raise HTTPException(status_code=403, detail="Not authorized as driver")
    return current_user

async def get_current_shipper(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "shipper":
        raise HTTPException(status_code=403, detail="Not authorized as shipper")
    return current_user
