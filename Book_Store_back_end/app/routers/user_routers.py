from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import APIRouter, Depends, HTTPException

from app.database import get_database
from app.services.user_service import UserService
from app.utils.dependencies import get_current_user
from app.models.pydantics.user_pydantic import UserCreate, UserUpdate, UserResponse,UserCreateResponse,UserUpdateResponse,UsersResponse


user_router = APIRouter(prefix="/users", tags=["Users"])

@user_router.post("/", response_model=UserCreateResponse)
async def create_user(user: UserCreate, db: AsyncIOMotorClient = Depends(get_database)):
    service = UserService(db)
    return await service.create_user(user)

@user_router.get("/", response_model=list[UsersResponse])
async def get_users(db: AsyncIOMotorClient = Depends(get_database)):
    service = UserService(db)
    return await service.retrieve_users()

@user_router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncIOMotorClient = Depends(get_database),
                    current_user = Depends(get_current_user)):
    if current_user.user_id != user_id:
        raise HTTPException(status_code=404, detail="Not Authorized to access this user")
    service = UserService(db)
    return await service.retrieve_user(user_id)

@user_router.patch("/{user_id}", response_model=UserUpdateResponse)
async def update_user(user_id: str, user: UserUpdate, db: AsyncIOMotorClient = Depends(get_database),
                      current_user = Depends(get_current_user)):
    if current_user.user_id != user_id:
        raise HTTPException(status_code=404, detail="Not Authorized to access this user")
    service = UserService(db)
    return await service.update_user(user_id, user)
