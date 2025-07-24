from pydantic import BaseModel,Field
from datetime import datetime,timezone

class Category(BaseModel):
    name : str = Field(...)
    description : str = Field(None)
    book_count: int = Field(0)
    created_at : datetime = Field(default_factory=lambda:datetime.now(timezone.utc))