"""Configuration management using pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment and .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    gemini_api_key: str
    model_id: str = "gemini-1.5-flash"


def get_settings() -> Settings:
    """Return application settings (singleton-style for use in Depends)."""
    return Settings()
