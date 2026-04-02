from urllib.parse import quote_plus

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    PHOTO_STORAGE_PATH: str = "./storage/photos"
    INSIGHTFACE_MODEL: str = "buffalo_l"

    FACE_MATCH_THRESHOLD: float = 0.4
    LIVENESS_THRESHOLD: float = 0.6

    @property
    def database_url(self) -> str:
        user = quote_plus(self.DB_USER)
        password = quote_plus(self.DB_PASSWORD)
        return (
            f"postgresql+asyncpg://{user}:{password}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    class Config:
        env_file = ".env"


settings = Settings()