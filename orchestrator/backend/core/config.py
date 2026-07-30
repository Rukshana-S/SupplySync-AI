from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SupplySync AI Orchestrator"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "PLACEHOLDER_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MONGODB_URI: str = "mongodb+srv://rukshanas2024cse_db_user:RzZ2tpfgAu9TgQ6t@supplysyncai.3xhlekb.mongodb.net/?retryWrites=true&w=majority&appName=SupplySyncAI"
    DATABASE_NAME: str = "SupplySyncAI"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
