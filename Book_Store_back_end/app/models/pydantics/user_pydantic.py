from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class RecentReviewSchema(BaseModel):
    book_id: str
    book_name: str
    rating: float
    comment: Optional[str] = None
    created_at: datetime



class UserCreate(BaseModel):
    username: str = Field(...,examples=["pradeepkumar.R"])
    password: str = Field(...,examples=["user@1234"])
    email: EmailStr = Field(...,examples=["pradeep@example.com"])
    first_name: str = Field(...,examples=["Pradeep"])
    last_name: str = Field(...,examples=["Kumr"])



class UserUpdate(BaseModel):
    username: str = Field(None,examples=["pradeepkumar.R"])
    email: EmailStr = Field(None,examples=["pradeep@example.com"])
    first_name: str = Field(None,examples=["Pradeep"])
    last_name: str = Field(None,examples=["Kumr"])


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    review_count: int
    recent_reviews: List[RecentReviewSchema]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class UsersResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    review_count: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]



class UserCreateResponse(UserResponse):
    username: str = Field(...)
    email: EmailStr = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)


class UserUpdateResponse(UserResponse):
    username: str = Field(None)
    email: EmailStr = Field(None)
    first_name: str = Field(None)
    last_name: str = Field(None)
