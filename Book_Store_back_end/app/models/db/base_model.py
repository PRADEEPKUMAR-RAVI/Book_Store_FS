from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime,timezone

class BookBaseSchema(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    
class CreateSchema(BaseModel):
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))

class CreateUpdateSchema(BaseModel):
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    updated_at : datetime = Field(default_factory=lambda:datetime.now(timezone.utc)) 

