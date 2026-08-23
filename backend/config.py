import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_default_database_url() -> str:
    if os.environ.get("VERCEL"):
        return "sqlite:////tmp/civicai.db"
    return f"sqlite:///{os.path.join(BASE_DIR, 'civicai.db')}"

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicAI"
    GEMINI_API_KEY: Optional[str] = None
    DATABASE_URL: str = get_default_database_url()

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

