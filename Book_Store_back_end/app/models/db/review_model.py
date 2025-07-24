from bson import ObjectId
from datetime import datetime,timezone
from pydantic import BaseModel, Field

class Review(BaseModel):
    book_id: ObjectId = Field(...)
    user_id: ObjectId = Field(...)
    rating: float = Field(...)  
    comment: str = Field(None)
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))

    class Config:
        arbitrary_types_allowed = True  
