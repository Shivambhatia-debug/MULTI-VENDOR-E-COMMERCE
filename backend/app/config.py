from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ecommerce"
    SECRET_KEY: str = "default_secret_key_for_development_only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # SMTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    SMTP_FROM: str = "Golalita <noreply@golalita.com>"

    # SkipCash Payment Gateway
    SKIPCASH_CLIENT_ID: str = ""
    SKIPCASH_KEY_ID: str = ""
    SKIPCASH_KEY_SECRET: str = ""
    SKIPCASH_WEBHOOK_KEY: str = ""
    SKIPCASH_BASE_URL: str = "https://skipcashtest.azurewebsites.net/"

    # Vercel Domains API
    VERCEL_TOKEN: str = ""
    VERCEL_PROJECT_ID: str = ""
    VERCEL_TEAM_ID: str = ""

    class Config:
        env_file = str(Path(__file__).resolve().parent.parent / ".env")

settings = Settings()
