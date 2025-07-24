from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from app.database import get_database
from app.services.auth_service import AuthService
from app.models.pydantics.user_pydantic import UserCreate
from app.models.pydantics.auth_pydantic import UserLogin, TokenResponse

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin, db: AsyncIOMotorClient = Depends(get_database)):
    return await AuthService(db).login_user(user)

@auth_router.post("/register")
async def register(user: UserCreate, db: AsyncIOMotorClient = Depends(get_database)):
    return await AuthService(db).register_user(user)
