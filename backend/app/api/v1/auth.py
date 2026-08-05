from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return AuthService.register(db, user)


@router.post(
    "/login",
    response_model=Token,
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    token = AuthService.login(
        db,
        user.email,
        user.password,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }