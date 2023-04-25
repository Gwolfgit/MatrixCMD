import urllib.parse

from loguru import logger
from fastapi import FastAPI, APIRouter
from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:5432@localhost/fastapi"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def import_router_prefixes(app: FastAPI, router: APIRouter, prefixes: list[str]):
    for prefix in prefixes:
        app.include_router(router, prefix=prefix)


def get_hex_dec_url(url_path):
    # extract hex data from URL path
    hex_data = urllib.parse.parse_qs(urllib.parse.urlparse(url_path).query)['cmd'][0]
    # remove "hex(" prefix and ")" suffix
    hex_data = hex_data.replace("hex(", "").replace(")", "")
    # split hex data by ',' delimiter and convert to decimal list
    decimal_list = [int(str(h), 16) for h in hex_data.split(',')]
    # convert decimal list to hex list
    hex_list = [hex(d) for d in decimal_list]
    return hex_list, decimal_list


def get_hex_dec_body(response_body):
    # extract hex data from response body
    hex_data = response_body.strip().replace('hex(', '').replace(')', '')
    # split hex data by ',' delimiter and convert to decimal list
    decimal_list = [int(str(h), 16) for h in hex_data.split(',')]
    # convert decimal list to hex list
    hex_list = [hex(d) for d in decimal_list]
    return hex_list, decimal_list


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
