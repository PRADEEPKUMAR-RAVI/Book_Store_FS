import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

DB_URL = os.environ.get('DB_URL')

def get_database():

    try:
        client = AsyncIOMotorClient(DB_URL)
        yield client["store"]

    except Exception as e:
        raise e
