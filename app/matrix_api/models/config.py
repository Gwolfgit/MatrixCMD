from pydantic import BaseSettings


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    upstream: str
    signup_enabled: bool
    uvicorn_error_log_disabled: bool
    uvicorn_access_log_disabled: bool
    proxy_log_commands: bool
    proxy_log_responses: bool

    class Config:
        env_file = ".env"


settings = Settings()
