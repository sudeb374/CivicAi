from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicAI"
    GEMINI_API_KEY: Optional[str] = None
    DATABASE_URL: str = "sqlite:///./backend/civicai.db"

    class Config:
        env_file = ".env"

settings = Settings()
