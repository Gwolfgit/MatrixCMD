from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

# local imports
from app.matrix_api.modules import utils, oAuth2
from app.matrix_api.models import schemas, users, config

router = APIRouter()


@router.post('/login', response_model=schemas.TokenResponse)
def login(credentials: OAuth2PasswordRequestForm = Depends(), db: utils.SessionLocal = Depends(utils.get_db)):
    user = db.query(users.Users).filter(
        users.Users.email == credentials.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Sorry no user found with provided email: {credentials.username}")

    if not utils.verify_password(credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Sorry no user found")

    access_token = oAuth2.create_access_token(data={"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=schemas.UsersResponse)
async def create_user(new_user: schemas.NewUser, db: Session = Depends(utils.get_db)):
    if not config.settings.signup_enabled:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Signup is disabled.")

    secure_password = utils.hash_password(new_user.password)
    new_user.password = secure_password

    created_user = users.Users(**new_user.dict())
    db.add(created_user)
    db.commit()
    db.refresh(created_user)
    return created_user
