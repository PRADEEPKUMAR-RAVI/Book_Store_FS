from pydantic import Field
from typing import Optional,List

from app.models.pydantics.base_model import CreateUpdateSchema,RequestSchema,BaseSchema


class CreateAuthor(RequestSchema):
    name: str = Field(...,examples=["Bharathiyar"])
    biography: str = Field(..., examples=["Bharathiyar is an American author of horror."])
    age: int = Field(...,examples=[22])
    country: str = Field(..., examples=["INDIA"])
    gender : str = Field(...,examples=['Male', 'Female'])
    awards: List[str] = Field(None, examples=["[\"Best writer of the Year - 2025\", \"best of 2024\"]"])


class UpdateAuthor(RequestSchema):
    name: str = Field(None,examples=["Bharathiyar"])
    biography: str = Field(None, examples=["Bharathiyar is an American author of horror."])
    age: int = Field(None,examples=[22])
    country: str = Field(None, examples=["INDIA"])
    gender : str = Field(None,examples=['Male', 'Female'])
    awards: List[str] = Field(None, examples=["[\"Best writer of the Year - 2025\", \"best of 2024\"]"])
    

class CreateAuthorResponse(CreateUpdateSchema):
    name: str = Field(...)
    biography : Optional[str] = Field(None)
    age : Optional[int] = Field(None)
    country : Optional[str] = Field(None)
    gender : str = Field(...,examples=['Prefer NTS , Male, Female'])
    awards : List[str] = Field(None, examples=["Best writer of the Year - 2025"])


class AuthorResponse(CreateUpdateSchema):
    name: str = Field(...)
    biography : Optional[str] = Field(None)
    books: List[BaseSchema] = Field(None,examples=[
        [
            BaseSchema(name="Disney Land", id='66829dde942d3b624dcdbc6c'),
            BaseSchema(name="The Island", id='66829dde942d3b6234dcdbc6c'),
            BaseSchema(name="Make in India", id='65454adse942d3b6234dcdbc6c')
        ]
    ])
    age : Optional[int] = Field(None)
    country : Optional[str] = Field(None)
    gender : str = Field(None,examples=['Prefer NTS , Male, Female'])
    awards : List[str] = Field(None, examples=["Best writer of the Year - 2025"])
    total_published: int = Field(None,examples=[5])
