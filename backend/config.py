import os
import shutil
from pydantic_settings import BaseSettings
from typing import Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
original_db_path = os.path.join(BASE_DIR, 'civicai.db')
tmp_db_path = '/tmp/civicai.db'

# If running on Vercel (read-only filesystem), copy DB to /tmp which is writable
if os.environ.get("VERCEL") or os.environ.get("VERCEL_ENV"):
    if os.path.exists(original_db_path) and not os.path.exists(tmp_db_path):
        shutil.copy2(original_db_path, tmp_db_path)
    db_path = tmp_db_path
else:
    db_path = original_db_path

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicAI"
    GEMINI_API_KEY: Optional[str] = None
    DATABASE_URL: str = f"sqlite:///{db_path}"

    class Config:
        env_file = ".env"

settings = Settings()
