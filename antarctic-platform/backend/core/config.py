import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # MongoDB — supports both local (mongodb://) and Atlas (mongodb+srv://)
    MONGO_URL: str = "mongodb://localhost:27017"
    MONGO_DB: str = "antarctic_platform"

    # JWT
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Groq AI (optional — offline fallback used if empty)
    GROQ_API_KEY: str = ""

    # CORS — in production set this to your Vercel frontend URL
    # Example: CORS_ORIGINS=["https://your-app.vercel.app"]
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Telemetry simulator update interval (seconds)
    TELEMETRY_INTERVAL_SECONDS: int = 5

    # Server port — Render injects PORT automatically; fallback 8000 for local dev
    PORT: int = int(os.environ.get("PORT", 8000))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        # Allow extra fields from environment without raising errors
        extra="ignore",
    )

settings = Settings()
