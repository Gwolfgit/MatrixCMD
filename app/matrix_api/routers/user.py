from typing import List

from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

from app.matrix_api.models.schemas import Users, NewUser, UsersResponse
from app.matrix_api.models.users import Users
from app.matrix_api.modules import utils


router = APIRouter(
    prefix='',
    tags=["Users"]
)


@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UsersResponse)
async def create_user(new_user: NewUser, db: Session = Depends(utils.get_db)):
    secure_password = utils.hash_password(new_user.password)
    new_user.password = secure_password

    created_user = Users(**new_user.dict())
    db.add(created_user)
    db.commit()
    db.refresh(created_user)
    return created_user


