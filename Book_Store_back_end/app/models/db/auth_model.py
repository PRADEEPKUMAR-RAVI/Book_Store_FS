from pydantic import Field
from app.models.db.base_model import CreateSchema


class Auth(CreateSchema):
    username : str = Field(...)
    password : str = Field(...) 