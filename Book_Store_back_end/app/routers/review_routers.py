from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from app.database import get_database
from app.services.review_service import ReviewService
from app.utils.dependencies import get_current_user
from app.models.pydantics.auth_pydantic import TokenPayload
from app.models.pydantics.review_pydantic import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse,
)


review_router = APIRouter(prefix="/books/{book_id}/reviews", tags=["Reviews"])

@review_router.get("/", response_model=list[ReviewResponse])
async def retrieve_reviews(book_id: str, db: AsyncIOMotorClient = Depends(get_database)):
    service = ReviewService(db)
    return await service.retrieve_reviews(book_id)


@review_router.post("/", response_model=ReviewResponse)
async def create_review(
    book_id: str,
    review: ReviewCreate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: TokenPayload = Depends(get_current_user)
):
    
    user_id = current_user.user_id  
    service = ReviewService(db)
    return await service.create_review(book_id, user_id, review)


@review_router.get("/{review_id}", response_model=ReviewResponse)
async def retrieve_review(book_id: str, review_id: str, db: AsyncIOMotorClient = Depends(get_database)):
    service = ReviewService(db)
    return await service.retrieve_review(book_id, review_id)


@review_router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    book_id: str,
    review_id: str,
    review: ReviewUpdate,
    db: AsyncIOMotorClient = Depends(get_database),
    current_user: TokenPayload = Depends(get_current_user)
):
    
    user_id = current_user.user_id  
    service = ReviewService(db)
    return await service.update_review(book_id, review_id, user_id, review)

@review_router.delete("/{review_id}")
async def delete_reviews(book_id:str,review_id:str,
                         db:AsyncIOMotorClient =Depends(get_database),
                         current_user:TokenPayload=Depends(get_current_user)):
    user_id = current_user.user_id
    service = ReviewService(db)
    return await service.delete_review(book_id,review_id,user_id)