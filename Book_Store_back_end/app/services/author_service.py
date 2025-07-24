from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
from fastapi import HTTPException

from app.models.pydantics.author_pydantic import AuthorResponse, CreateAuthor, CreateAuthorResponse
from app.models.pydantics.book_pydantic import BaseSchema
from app.models.db.author_model import Author


class AuthorService:

    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = self.db.author
        self.book_collection = self.db.books

    async def retrieve_authors(self) -> List[CreateAuthorResponse]:
        cursor = self.collection.find()
        authors = []
        async for author in cursor:
            enriched = await self._enrich_author(author)
            authors.append(AuthorResponse(**enriched))
        return authors

    async def create_author(self, data: CreateAuthor) -> CreateAuthorResponse:
        author = Author(**data.model_dump())
        result = await self.collection.insert_one(author.model_dump())
        return await self.retrieve_author(str(result.inserted_id))

    async def retrieve_author(self, author_id: str) -> AuthorResponse:
        author = await self._get_author_or_404(author_id)
        enriched = await self._enrich_author(author)
        return AuthorResponse(**enriched)
    
    async def delete_Author(self,author_id:str):
        author = await self.collection.delete_one({'_id':ObjectId(author_id)})
        if author.deleted_count == 1:
            return {"msg":"Deleted Successfully"}
        else:
            raise HTTPException(status_code=404, detail="Author not found")

    async def update_author(self, author_id: str, data: CreateAuthor) -> AuthorResponse:
        await self._get_author_or_404(author_id)
        update_data = data.model_dump(exclude_unset=True)
        await self.collection.update_one({'_id': ObjectId(author_id)}, {'$set': update_data})
        return await self.retrieve_author(author_id)

    async def get_book_details(self, author_id: str) -> List[BaseSchema]:
        cursor = self.book_collection.find({'author_id': author_id})
        books = []
        async for book in cursor:
            book = self._replace_id(book)
            books.append(BaseSchema(**book))
        return books

    async def _enrich_author(self, author: dict) -> dict:
        author = self._replace_id(author)
        books = await self.get_book_details(author['id'])
        author['books'] = [book.model_dump() for book in books[:3]]
        author['total_published'] = len(books)
        return author

    async def _get_author_or_404(self, author_id: str) -> dict:
        if not ObjectId.is_valid(author_id):
            raise HTTPException(status_code=400, detail="Invalid author ID format.")
        author = await self.collection.find_one({'_id': ObjectId(author_id)})
        if not author:
            raise HTTPException(status_code=404, detail='Author not found.')
        return author

    @staticmethod
    def _replace_id(doc: dict) -> dict:
        doc['id'] = str(doc.pop('_id'))
        return doc
