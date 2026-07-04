from typing import Annotated, Any, Literal

from pydantic import AnyUrl, BeforeValidator, Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    return v


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    PROJECT_NAME: str = "MarketMindAI"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    # Database settings (Example placeholder for production readiness)
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""

    SQLALCHEMY_DATABASE_URI: PostgresDsn | None = None


settings = Settings()