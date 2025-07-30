from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from app.routers.category_routers import category_router
from app.routers.author_routers import author_router
from app.routers.book_routers import book_router
from app.routers.user_routers import user_router
from app.routers.review_routers import review_router
from app.routers.auth_routers import auth_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(book_router)
app.include_router(category_router)
app.include_router(author_router)
app.include_router(user_router)
app.include_router(review_router)
app.include_router(auth_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000)
