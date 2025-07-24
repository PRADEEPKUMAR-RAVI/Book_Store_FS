from typing import Optional,List
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from app.models.pydantics.base_model import CreateSchema, RequestSchema,AuthorSchema

class TopBooksSchema(BaseModel):
    id: str
    title: str
    average_rating: float
    author: Optional[AuthorSchema] = None


class CategoryCreate(RequestSchema):
    name: str = Field(..., example="Cartoon")
    description: Optional[str] = Field(None, example="Tom and Jerry")


class CategoryUpdate(RequestSchema):
    name: Optional[str] = Field(None, example="Cartoon")
    description: Optional[str] = Field(None, example="Tom and Jerry")
    

class CategorysResponse(CreateSchema):
    name: str
    description: Optional[str]
    book_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CategoryResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    book_count: int
    top_books: List[TopBooksSchema] = []
    created_at: Optional[datetime]




