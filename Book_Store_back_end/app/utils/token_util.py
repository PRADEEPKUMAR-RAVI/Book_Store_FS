import os
from fastapi.responses import JSONResponse
from jose import jwt
from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi import HTTPException, status
from fastapi import Response
from datetime import datetime, timedelta, timezone

from app.models.pydantics.auth_pydantic import TokenPayload, TokenResponse

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_MINUTES = 300
ALGORITHM = os.getenv("ALGORITHM")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET_KEY")

def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_hashed_password(password: str, hashed_pass: str) -> bool:
    return pwd_context.verify(password, hashed_pass)

def generate_tokens(user_id: str) -> TokenResponse:
    
    access_token=create_token(user_id, "access"),
    refresh_token=create_token(user_id, "refresh")
    response = JSONResponse(content={"access_token": access_token})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="strict",
        secure=True  # Only over HTTPS
    )
    return response
    

def create_token(user_id: str, token_type: str) -> str:
    exp_minutes = ACCESS_TOKEN_EXPIRE_MINUTES if token_type == "access" else REFRESH_TOKEN_EXPIRE_MINUTES
    expire = datetime.now(timezone.utc) + timedelta(minutes=exp_minutes)
    payload = {"user_id": user_id, "exp": expire, "token_type": token_type}
    key = JWT_SECRET_KEY if token_type == "access" else JWT_REFRESH_SECRET_KEY
    return jwt.encode(payload, key, algorithm=ALGORITHM)


def validate_token(token: str, token_type: str) -> TokenPayload:
    try:
        key = JWT_REFRESH_SECRET_KEY if token_type == "refresh token" else JWT_SECRET_KEY
        payload = jwt.decode(token, key, algorithms=[ALGORITHM])
        return TokenPayload(user_id=payload["user_id"], exp=datetime.fromtimestamp(payload["exp"], timezone.utc),
                            token_type=payload["token_type"], valid=True)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"{token_type} expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid {token_type}")

