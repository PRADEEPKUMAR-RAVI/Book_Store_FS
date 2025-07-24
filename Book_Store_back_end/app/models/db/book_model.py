from datetime import date
from typing import List, Optional
from pydantic import Field

from app.models.db.base_model import CreateUpdateSchema
from app.models.pydantics.category_pydantic import CategoryResponse

class Book(CreateUpdateSchema):
    name: str
    publication_date: Optional[date] = Field(None)  
    description: Optional[str] = Field(None)
    page_count: Optional[int] =Field(None)
    language: Optional[str] = Field(None)
    author_id: str
    category_ids: List[str]
    is_published: bool


