from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: list[str] = ["*"]

    # External API keys
    GEMINI_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""
    DEFAULT_LATITUDE: float = 22.7196
    DEFAULT_LONGITUDE: float = 75.8577

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()