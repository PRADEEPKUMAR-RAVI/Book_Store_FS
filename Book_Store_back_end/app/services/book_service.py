from bson import ObjectId
from fastapi import HTTPException
from typing import List, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

from app.models.pydantics.book_pydantic import (
    BookCreate, BookUpdate, BookResponse, BaseSchema, CreateBookResponse
)

class BookService:

    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = self.db.books
        self.authors_collection = self.db.author
        self.category_collection = self.db.category
        self.review_collection = self.db.reviews

    async def create_book(self, book: BookCreate) -> CreateBookResponse:
        author = await self.authors_collection.find_one({'_id': ObjectId(book.author_id)})
        if not author:
            raise HTTPException(status_code=404, detail="Author not found")

        category_ids = []
        for cat_id in book.category_ids:
            category = await self.category_collection.find_one({'_id': ObjectId(cat_id)})
            if not category:
                raise HTTPException(status_code=404, detail=f"Category '{cat_id}' not found.")
            category_ids.append(str(category['_id']))

        now = datetime.now(timezone.utc)
        book_data = {
            "name": book.name,
            "description": book.description,
            "author_id": str(author['_id']),
            "category_ids": category_ids,
            "publication_date": book.publication_date,
            "page_count": book.page_count,
            "language": book.language,
            "is_published": book.is_published,
            "created_at": now,
            "updated_at": now,
        }

        result = await self.collection.insert_one(book_data)
        await self._update_category_book_counts(category_ids)
        return await self.retrieve_book(str(result.inserted_id))

    async def retrieve_books(self, published_filter: str) -> List[BookResponse]:
        query = {
            "Published": {"is_published": True},
            "Non-Published": {"is_published": False}
        }.get(published_filter, {})

        books = []
        async for book in self.collection.find(query):
            books.append(BookResponse(**await self.__enrich_book(book)))
        return books

    async def retrieve_book(self, book_id: str) -> BookResponse:
        book = await self.collection.find_one({'_id': ObjectId(book_id)})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        return BookResponse(**await self.__enrich_book(book))
    
    async def delete_book(self, book_id:str):
        book = await self.collection.delete_one({'_id':ObjectId(book_id)})
        if book.deleted_count==1:
            print(["Deleted Scuccessfully"])
            return {"message":"Successfully Deleted"}
        else:
            raise HTTPException(status_code=404, detail="Book not found")
        

    async def update_book(self, book_id: str, book: BookUpdate) -> CreateBookResponse:
        book_doc = await self.collection.find_one({'_id': ObjectId(book_id)})
        if not book_doc:
            raise HTTPException(status_code=404, detail="Book not found")

        update_data = {k: v for k, v in book.model_dump(exclude_unset=True).items()}
        old_category_ids = book_doc.get("category_ids", [])
        new_category_ids = old_category_ids

        if 'category_ids' in update_data:
            new_category_ids = []
            for cat_id in update_data['category_ids']:
                category = await self.category_collection.find_one({'_id': ObjectId(cat_id)})
                if not category:
                    raise HTTPException(status_code=404, detail=f"Category '{cat_id}' not found.")
                new_category_ids.append(str(category['_id']))
            update_data['category_ids'] = new_category_ids

        update_data["updated_at"] = datetime.now(timezone.utc)
        await self.collection.update_one({'_id': ObjectId(book_id)}, {'$set': update_data})

        affected_categories = list(set(old_category_ids + new_category_ids))
        await self._update_category_book_counts(affected_categories)

        return await self.retrieve_book(book_id)

    async def _update_category_book_counts(self, category_ids: List[str]):
        for cat_id in category_ids:
            count = await self.collection.count_documents({"category_ids": cat_id})
            await self.category_collection.update_one(
                {"_id": ObjectId(cat_id)},
                {"$set": {"book_count": count}}
            )

    async def __get_review_summary(self, book_id: str) -> Dict[str, Any]:
        cursor = self.review_collection.find({'book_id': ObjectId(book_id)})
        total, rating_sum = 0, 0
        async for review in cursor:
            total += 1
            rating_sum += review.get('rating', 0)
        avg = round(rating_sum / total, 2) if total else 0
        return {'average_rating': avg, 'total_reviews': total}

    async def __enrich_book(self, book: dict) -> dict:
        book = self.__replace_id(book)

        # Safely fetch categories
        categories = []
        for cat_id in book.get("category_ids", []):
            if ObjectId.is_valid(cat_id):
                category = await self.category_collection.find_one({'_id': ObjectId(cat_id)})
                if category:
                    categories.append(
                        BaseSchema(id=str(category['_id']), name=category['name']).model_dump()
                    )
        book['categories'] = categories

        # Safely fetch author
        author_id = book.get('author_id')
        if ObjectId.is_valid(author_id):
            author = await self.authors_collection.find_one({'_id': ObjectId(author_id)})
            book['author'] = (
                BaseSchema(id=str(author['_id']), name=author.get('name', '')).model_dump()
                if author else None
            )
        else:
            book['author'] = None  # If author_id is missing or invalid

        # Review summary
        book.update(await self.__get_review_summary(book['id']))
        return book

    @staticmethod
    def __replace_id(document: dict) -> dict:
        document['id'] = str(document.pop('_id'))
        return document
