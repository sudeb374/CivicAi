import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_default_database_url() -> str:
    env_db = os.environ.get("DATABASE_URL")
    if env_db and env_db.strip():
        return env_db.strip()
    if os.environ.get("VERCEL"):
        return "sqlite:////tmp/civicai.db"
    return f"sqlite:///{os.path.join(BASE_DIR, 'civicai.db')}"

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicAI"
    GEMINI_API_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = None

    @property
    def effective_database_url(self) -> str:
        if self.DATABASE_URL and self.DATABASE_URL.strip():
            return self.DATABASE_URL.strip()
        return get_default_database_url()

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
