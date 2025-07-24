from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

from app.models.db.user_model import User
from app.utils.token_util import get_hashed_password
from app.models.pydantics.user_pydantic import (
    UserCreate,
    UserUpdate,
    UserCreateResponse,
    UserUpdateResponse,
    UserResponse,
    UsersResponse,
)


class UserService:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.users
        self.book_collection = db.books
        self.author_collection = db.author
        self.review_collection = db.reviews
        self.category_collection = db.category

    async def retrieve_users(self) -> list[UsersResponse]:
        result = self.collection.find()
        users = []
        async for user in result:
            user = self.__replace_id(user)

            
            recent_reviews = []
            reviews_cursor = self.review_collection.find(
                {"user_id": ObjectId(user["id"])}
            ).sort("created_at", -1).limit(1)

            async for review in reviews_cursor:
                book = await self.book_collection.find_one({"_id": review["book_id"]})
                book_name = book["name"] if book else "Unknown"

                recent_reviews.append({
                    "book_id": str(review["book_id"]),
                    "book_name": book_name,
                    "rating": review["rating"],
                    "comment": review.get("comment"),
                    "created_at": review["created_at"],
                })

            user["recent_reviews"] = recent_reviews


            user["review_count"] = await self.review_collection.count_documents({
                "user_id": ObjectId(user["id"])
            })

            users.append(UserResponse(**user))
        return users

    async def create_user(self, user_create: UserCreate) -> UserCreateResponse:
        existing_user = await self.collection.find_one({
            "$or": [{"username": user_create.username}, {"email": user_create.email}]
        })

        print("-------------------",existing_user)

        if existing_user:
            if existing_user.get("username") == user_create.username:
                raise HTTPException(status_code=400, detail="Username already exists")
            else:
                raise HTTPException(status_code=400, detail="Email already exists")

        user_dict = user_create.model_dump()
        user_dict["password"] = get_hashed_password(user_dict["password"])
        user_dict["review_count"] = 0
        user_dict["recent_reviews"] = []
        user_dict["created_at"] = datetime.now(timezone.utc)
        user_dict["updated_at"] = datetime.now(timezone.utc)

        user = User(**user_dict)
        result = await self.collection.insert_one(user.model_dump())
        return await self.retrieve_user(str(result.inserted_id))

    async def retrieve_user(self, user_id: str) -> UserResponse:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user = self.__replace_id(user)

       
        recent_reviews = []
        reviews_cursor = self.review_collection.find(
            {"user_id": ObjectId(user["id"])}
        ).sort("created_at", -1).limit(3)

        async for review in reviews_cursor:
            book = await self.book_collection.find_one({"_id": review["book_id"]})
            book_name = book["name"] if book else "Unknown"

            recent_reviews.append({
                "book_id": str(review["book_id"]),
                "book_name": book_name,
                "rating": review["rating"],
                "comment": review.get("comment"),
                "created_at": review["created_at"],
            })

        user["recent_reviews"] = recent_reviews

        
        user["review_count"] = await self.review_collection.count_documents({
            "user_id": ObjectId(user["id"])
        })

        return UserResponse(**user)

    async def update_user(self, user_id: str, user_update: UserUpdate) -> UserUpdateResponse:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        update_data = user_update.model_dump(exclude_unset=True)

        if "username" in update_data:
            existing = await self.collection.find_one({
                "username": update_data["username"],
                "_id": {"$ne": ObjectId(user_id)}
            })
            if existing:
                raise HTTPException(status_code=400, detail="Username already exists")

        if "email" in update_data:
            existing = await self.collection.find_one({
                "email": update_data["email"],
                "_id": {"$ne": ObjectId(user_id)}
            })
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")

        update_data["updated_at"] = datetime.now(timezone.utc)

        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        return await self.retrieve_user(user_id)

    @staticmethod
    def __replace_id(document):
        document["id"] = str(document.pop("_id"))
        return document
