from typing import List
from pydantic import BaseModel,Field
from datetime import datetime,timezone


class Author(BaseModel):
    name: str = Field(...)
    biography : str = Field(None)
    age: int = Field(None)
    awards: List[str] = Field(None)
    country: str = Field(...)
    gender : str = Field(...)
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))