from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.database import get_db
from app.exceptions.auth import InvalidCredentialsException
from app.models.user import User

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise InvalidCredentialsException()

    user_id = payload.get("sub")

    if user_id is None:
        raise InvalidCredentialsException()

    stmt = select(User).where(User.id == int(user_id))

    user = db.execute(stmt).scalar_one_or_none()

    if user is None:
        raise InvalidCredentialsException()

    return user