from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.exceptions import (
    UserAlreadyExistsException,
    InvalidCredentialsException,
)

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    @staticmethod
    def register(db: Session, user: UserCreate):

        stmt = select(User).where(
            or_(
                User.email == user.email,
                User.username == user.username,
            )
        )

        existing_user = db.execute(stmt).scalar_one_or_none()

        if existing_user:
            raise UserAlreadyExistsException()

        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password),
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str,
    ):

        stmt = select(User).where(User.email == email)

        user = db.execute(stmt).scalar_one_or_none()

        if user is None:
            raise InvalidCredentialsException()

        if not verify_password(
            password,
            user.hashed_password,
        ):
            raise InvalidCredentialsException()

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
            }
        )

        return token