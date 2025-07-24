from typing import List
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

from app.models.db.review_model import Review
from app.models.pydantics.review_pydantic import ReviewCreate, ReviewUpdate, ReviewResponse

class ReviewService:
    def __init__(self, db: AsyncIOMotorClient):
        self.collection = db.reviews
        self.book_collection = db.books
        self.user_collection = db.users

    async def create_review(self, book_id: str, user_id: str, review: ReviewCreate) -> ReviewResponse:
        if not ObjectId.is_valid(book_id) or not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid book or user ID")

        book = await self.book_collection.find_one({"_id": ObjectId(book_id)})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")

        user = await self.user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        review_obj = Review(
            book_id=ObjectId(book_id),
            user_id=ObjectId(user_id),
            rating=review.rating,
            comment=review.comment
        )

        result = await self.collection.insert_one(review_obj.model_dump())
        review_id = result.inserted_id

        recent_entry = {
            "review_id": str(review_id),
            "book_id": book_id,
            "book_name": book.get("name", "Unknown"),
            "rating": review.rating,
            "created_at": review_obj.created_at
        }

        await self.user_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$inc": {"review_count": 1},
                "$push": {
                    "recent_reviews": {
                        "$each": [recent_entry],
                        "$position": 0,
                        "$slice": 3
                    }
                }
            }
        )

        return await self.get_review(str(review_id))

    async def get_review(self, review_id: str) -> ReviewResponse:
        if not ObjectId.is_valid(review_id):
            raise HTTPException(status_code=400, detail="Invalid review ID")
        review = await self.collection.find_one({"_id": ObjectId(review_id)})
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        review["id"] = str(review.pop("_id"))
        return ReviewResponse(**review)

    async def retrieve_reviews(self, book_id: str) -> List[ReviewResponse]:
        if not ObjectId.is_valid(book_id):
            raise HTTPException(status_code=400, detail="Invalid book ID")

        cursor = self.collection.find({"book_id": ObjectId(book_id)})
        reviews = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            reviews.append(ReviewResponse(**doc))
        return reviews

    async def retrieve_review(self, book_id: str, review_id: str) -> ReviewResponse:
        if not ObjectId.is_valid(book_id) or not ObjectId.is_valid(review_id):
            raise HTTPException(status_code=400, detail="Invalid ID")
        review = await self.collection.find_one({
            "_id": ObjectId(review_id),
            "book_id": ObjectId(book_id)
        })
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        review["id"] = str(review.pop("_id"))
        return ReviewResponse(**review)

    async def update_review(self, book_id: str, review_id: str, user_id: str, review: ReviewUpdate) -> ReviewResponse:
        if not all(ObjectId.is_valid(i) for i in [book_id, review_id, user_id]):
            raise HTTPException(status_code=400, detail="Invalid ID")

        existing_review = await self.collection.find_one({
            "_id": ObjectId(review_id),
            "book_id": ObjectId(book_id),
            "user_id": ObjectId(user_id)
        })
        if not existing_review:
            raise HTTPException(status_code=404, detail="Review not found or not authorized")

        update_data = review.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now(timezone.utc)

        await self.collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": update_data}
        )

        return await self.get_review(review_id)
    
    async def delete_review(self,book_id:str, review_id:str, user_id:str):
        if not all(ObjectId.is_valid(i) for i in [book_id, review_id, user_id]):
            raise HTTPException(status_code=400, detail="Invalid ID")
        
        review = await self.collection.delete_one({
            "_id":ObjectId(review_id),
            "book_id":ObjectId(book_id),
            "user_id":ObjectId(user_id)
        })

        if review.deleted_count ==1:
            return {"msg":"Deleted Successfully"}
        else:
            raise HTTPException(status_code=404,detail="Invalid ID")
