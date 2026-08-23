import os
from pydantic_settings import BaseSettings
from typing import Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicAI"
    GEMINI_API_KEY: Optional[str] = None
    DATABASE_URL: str = f"sqlite:///{os.path.join(BASE_DIR, 'civicai.db')}"

    class Config:
        env_file = ".env"

settings = Settings()
