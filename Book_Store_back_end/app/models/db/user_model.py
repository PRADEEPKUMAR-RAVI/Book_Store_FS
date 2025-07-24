from typing import List
from datetime import datetime,timezone
from pydantic import BaseModel, EmailStr, Field


class RecentReviewSchema(BaseModel):
    book_id: str
    book_name: str
    rating: float
    comment: str = ""
    created_at: datetime


class User(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    review_count: int = Field(0)
    recent_reviews: List[RecentReviewSchema] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=datetime.now(timezone.utc))
