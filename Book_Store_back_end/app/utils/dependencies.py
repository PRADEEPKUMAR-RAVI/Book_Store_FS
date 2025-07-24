from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.utils.token_util import validate_token
from app.models.pydantics.auth_pydantic import TokenPayload

bearer_scheme = HTTPBearer()

def validate_access_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> TokenPayload:
    token = credentials.credentials
    payload = validate_token(token, "access token")
    if payload.token_type != "access":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token type")
    return payload

def validate_refresh_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> TokenPayload:
    token = credentials.credentials
    payload = validate_token(token, "refresh token")
    if payload.token_type != "refresh":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token type")
    return payload


def get_current_user(token_data: TokenPayload = Depends(validate_access_token)) -> TokenPayload:
    return token_data
