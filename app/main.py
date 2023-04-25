import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# from app.matrix_api.modules.utils import import_router_prefixes, Base, engine
# from app.matrix_api.routers import user, auth, matrix, proxy
from app.matrix_api.routers import matrix, proxy
from app.matrix_api.models.config import settings


# Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:80",
    "http://localhost:4173",
    "http://192.168.1.8:80",
    "http://192.168.1.8:8000",
    "http://192.168.1.8:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uvicorn_error = logging.getLogger("uvicorn.error")
uvicorn_error.disabled = settings.uvicorn_error_log_disabled
uvicorn_access = logging.getLogger("uvicorn.access")
uvicorn_access.disabled = settings.uvicorn_access_log_disabled

app.include_router(proxy.router)
# app.include_router(auth.router)
app.include_router(matrix.router)
