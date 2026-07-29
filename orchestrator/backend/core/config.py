from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SupplySync AI Orchestrator"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "PLACEHOLDER_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "supplysync_orchestrator"

    class Config:
        case_sensitive = True

settings = Settings()
