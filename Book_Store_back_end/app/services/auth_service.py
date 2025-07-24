from typing import List
from bson import ObjectId
from pydantic import Field
from datetime import datetime,timezone
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient

from app.models.pydantics.user_pydantic import UserCreate
from app.models.pydantics.auth_pydantic import UserLogin, TokenResponse
from app.utils.token_util import get_hashed_password, verify_hashed_password, generate_tokens

class AuthService:
    def __init__(self, db: AsyncIOMotorClient):
        self.user_collection = db["users"]

    async def login_user(self, credentials: UserLogin) -> TokenResponse:
        user = await self.user_collection.find_one({"username": credentials.username})
        if not user or not verify_hashed_password(credentials.password, user["password"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return generate_tokens(str(user["_id"]))

    async def register_user(self, data: UserCreate) ->str:
        if await self.user_collection.find_one({"username": data.username}):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
        hashed_pw = get_hashed_password(data.password)
        user_doc = {**data.model_dump(), "password": hashed_pw,
                    "review_count": 0,
                    "recent_reviews":[],
                    "created_at":datetime.now(timezone.utc),
                    "updated_at": None}
        result = await self.user_collection.insert_one(user_doc)
        # return generate_tokens(str(result.inserted_id))
        return {"msg":"Registered Successfully !!"}
