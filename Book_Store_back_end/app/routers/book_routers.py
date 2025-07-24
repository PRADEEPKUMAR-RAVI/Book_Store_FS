from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import APIRouter, Depends, HTTPException, Query

from app.database import get_database
from app.services.book_service import BookService
from app.models.pydantics.book_pydantic import BookCreate, BookUpdate, BookResponse,CreateBookResponse

book_router = APIRouter(prefix='/books', tags=['Books'])

@book_router.get('/', response_model=List[BookResponse])
async def retrieve_all_books(
    publish_category: str = Query("None", enum=['None', 'Published', 'Non-Published']),
    db: AsyncIOMotorClient = Depends(get_database)
):
    service = BookService(db)
    return await service.retrieve_books(publish_category)


@book_router.post('/', response_model=CreateBookResponse, status_code=201)
async def create_book(
    book: BookCreate,
    db: AsyncIOMotorClient = Depends(get_database)
):
    service = BookService(db)
    return await service.create_book(book)


@book_router.get('/{book_id}', response_model=BookResponse)
async def retrieve_book(
    book_id: str,
    db: AsyncIOMotorClient = Depends(get_database)
):
    service = BookService(db)
    try:
        return await service.retrieve_book(book_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@book_router.put('/{book_id}', response_model=CreateBookResponse)
async def update_book(
    book_id: str,
    book: BookUpdate,
    db: AsyncIOMotorClient = Depends(get_database)
):
    service = BookService(db)
    try:
        return await service.update_book(book_id, book)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@book_router.delete('/{book_id}')
async def delete_book(
    book_id:str,
    db:AsyncIOMotorClient = Depends(get_database)
):
    service = BookService(db)
    try:
        return await service.delete_book(book_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
