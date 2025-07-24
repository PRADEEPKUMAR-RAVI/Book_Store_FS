from typing import Optional
from datetime import datetime,timezone
from pydantic import BaseModel,Field



class RequestSchema(BaseModel):
    pass

class AuthorSchema(BaseModel):
    id : str= Field(...,examples=['9gdg76d8g67d7g6'])
    name : str= Field(...,examples=["Steve Smith"])

class BaseSchema(BaseModel):
    id: str = Field(...,examples=['9gdg76d8g67d7g6'])
    name: str = Field(...,examples=["Steve Smith"])

class CreateSchema(BaseModel):
    id: str = Field(..., examples=["6683f946ec61bfa6a3c2d7c7"])
    created_at : datetime = Field(default_factory=lambda:datetime.now(timezone.utc))

class BookBaseSchema(BaseModel):
    id: str = Field(..., examples=["6683f946ec61bfa6a3c2d7c7"])
    title: str = Field(..., examples=["The Great Gatsby"])

class CreateUpdateSchema(BaseModel):
    id: str = Field(...)
    created_at : datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    updated_at : datetime = Field(default_factory=lambda:datetime.now(timezone.utc))





