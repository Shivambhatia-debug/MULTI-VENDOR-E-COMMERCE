from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    MONGODB_URL: str
    DATABASE_NAME: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    class Config:
        env_file = str(Path(__file__).resolve().parent.parent / ".env")

settings = Settings()
