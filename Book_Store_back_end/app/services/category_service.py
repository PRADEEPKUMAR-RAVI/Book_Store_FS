from typing import List
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

from app.models.db.category_model import Category
from app.models.pydantics.category_pydantic import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategorysResponse,
    AuthorSchema,
    TopBooksSchema
)


class CategoryService:

    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = db.category
        self.book_collection = db.books
        self.author_collection = db.author

    async def retrieve_categories(self) -> List[CategorysResponse]:
        cursor = self.collection.find()
        categories = []
        async for category in cursor:
            category_id = str(category["_id"])

           
            book_count = await self.book_collection.count_documents({"category_ids": category_id})

            categories.append(CategorysResponse(
                id=category_id,
                name=category["name"],
                description=category.get("description"),
                book_count=book_count,
                created_at=category.get("created_at", datetime.now(timezone.utc))
            ))
        return categories

    async def retrieve_category(self, category_id: str) -> CategoryResponse:
        if not ObjectId.is_valid(category_id):
            raise HTTPException(status_code=400, detail="Invalid category ID")

        category = await self.collection.find_one({'_id': ObjectId(category_id)})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        category = self.__replace_id(category)

        book_count = await self.book_collection.count_documents({"category_ids": category_id})

        all_books_cursor = self.book_collection.find({"category_ids": category_id})
        books_with_ratings = []

        async for book in all_books_cursor:
            book_id = str(book["_id"])
            author = None
            rating_sum = 0
            total_reviews = 0

            reviews_cursor = self.db.reviews.find({"book_id": ObjectId(book_id)})
            async for review in reviews_cursor:
                rating_sum += review.get("rating", 0)
                total_reviews += 1

            avg_rating = round(rating_sum / total_reviews, 2) if total_reviews > 0 else 0

            if "author_id" in book and book["author_id"]:
                author_doc = await self.author_collection.find_one({"_id": ObjectId(book["author_id"])})
                if author_doc:
                    author = AuthorSchema(id=str(author_doc["_id"]), name=author_doc["name"])

            books_with_ratings.append({
                "id": book_id,
                "title": book["name"],
                "average_rating": avg_rating,
                "author": author
            })

        top_books_sorted = sorted(books_with_ratings, key=lambda x: x["average_rating"], reverse=True)
        top_books = [TopBooksSchema(**b) for b in top_books_sorted[:2]]

        return CategoryResponse(
            **category,
            top_books=top_books
        )


    async def create_category(self, category: CategoryCreate) -> CategorysResponse:
        existing = await self.collection.find_one({"name": {"$regex": f"^{category.name}$", "$options": "i"}})
        if existing:
            raise HTTPException(status_code=400, detail="Category already exists")

        category_data = category.model_dump()
        category_data["created_at"] = datetime.now(timezone.utc)

        category_obj = Category(**category_data)
        result = await self.collection.insert_one(category_obj.model_dump())
        return await self.retrieve_category(str(result.inserted_id))

    async def update_category(self, category_id: str, category: CategoryUpdate) -> CategorysResponse:
        if not ObjectId.is_valid(category_id):
            raise HTTPException(status_code=400, detail='Invalid Category ID')

        exists = await self.collection.find_one({'_id': ObjectId(category_id)})
        if not exists:
            raise HTTPException(status_code=404, detail='Category not found')

        update_data = category.model_dump(exclude_unset=True)
        await self.collection.update_one({'_id': ObjectId(category_id)}, {'$set': update_data})
        return await self.retrieve_category(category_id)
    
    async def delete_category(self, category_id:str):
        cat = await self.collection.delete_one({'_id':ObjectId(category_id)})
        if cat.deleted_count == 1:
            return {"msg":"Deleted successfully!"}
        else:
            raise HTTPException(status_code=404, detail="Category not Found")

    @staticmethod
    def __replace_id(document):
        document['id'] = str(document.pop('_id'))
        return document



