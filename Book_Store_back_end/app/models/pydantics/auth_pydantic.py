from datetime import datetime
from pydantic import BaseModel, Field

class TokenRequest(BaseModel):
    id: str
    username: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str

class TokenPayload(BaseModel):  
    user_id: str
    exp: datetime
    token_type: str
    valid: bool = True

class UserLogin(BaseModel):
    username: str = Field(...,examples=["pradeepkumar"])
    password: str = Field(...,examples=["user@1234"])
