from typing import Optional, List
from datetime import date,datetime
from pydantic import Field

from app.models.pydantics.base_model import CreateUpdateSchema, RequestSchema, BaseSchema


class BookCreate(RequestSchema):
    name: str = Field(..., examples=["Harry Potter and the Chamber of Secrets"])
    description: Optional[str] = Field(None, examples=["This is a description about the book."])
    author_id: str = Field(..., examples=["663a32b96e21f0c7b1d40db5"])
    category_ids: List[str] = Field(..., examples=[["663a31e46e21f0c7b1d40db4"]])
    publication_date: Optional[datetime] = Field(None, examples=["2000-07-08"])
    page_count: Optional[int] = Field(None, examples=[341])
    language: Optional[str] = Field(None, examples=["English"])
    is_published: Optional[bool] = Field(False)


class BookUpdate(RequestSchema):
    name: Optional[str] = Field(None, examples=["Harry Potter and the Chamber of Secrets"])
    description: Optional[str] = Field(None, examples=["This is a description about the book."])
    author_id: Optional[str] = Field(None, examples=["663a32b96e21f0c7b1d40db5"])
    category_ids: Optional[List[str]] = Field(None, examples=[["663a31e46e21f0c7b1d40db4"]])
    publication_date: Optional[datetime] = Field(None, examples=["2000-07-08"])
    page_count: Optional[int] = Field(None, examples=[341])
    language: Optional[str] = Field(None, examples=["English"])
    is_published: Optional[bool] = Field(None)


class BookResponse(CreateUpdateSchema):
    name: str
    description: Optional[str] = None
    author: Optional[BaseSchema] 
    categories: List[BaseSchema] = []
    publication_date: Optional[date] = None
    page_count: Optional[int] = None
    language: Optional[str] = None
    is_published: bool = False
    average_rating: float
    total_reviews: int


class CreateBookResponse(CreateUpdateSchema):
    name: str
    description: Optional[str] = None
    author: Optional[BaseSchema] = None
    categories: List[BaseSchema] = []
    publication_date: Optional[date] = None
    page_count: Optional[int] = None
    language: Optional[str] = None
    is_published: bool = False

