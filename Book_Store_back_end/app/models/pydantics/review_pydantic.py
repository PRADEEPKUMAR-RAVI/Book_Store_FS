from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    rating: float = Field(..., ge=1, le=5, examples=["4.2"])
    comment: Optional[str] = Field(None,examples=["This is the best Book"])

class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(..., ge=1, le=5, examples=["4.2"])
    comment: Optional[str] = Field(None,examples=["This is the best Book"])

class ReviewResponse(BaseModel):
    id: str
    rating:float = Field(...)
    comment : str = Field(...)
    created_at: datetime
    updated_at: Optional[datetime]

