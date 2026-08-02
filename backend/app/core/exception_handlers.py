from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions import (
    UserAlreadyExistsException,
    InvalidCredentialsException,
)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(UserAlreadyExistsException)
    async def user_exists_handler(
        request: Request,
        exc: UserAlreadyExistsException,
    ):
        return JSONResponse(
            status_code=400,
            content={
                "detail": "User already exists"
            },
        )

    @app.exception_handler(InvalidCredentialsException)
    async def invalid_credentials_handler(
        request: Request,
        exc: InvalidCredentialsException,
    ):
        return JSONResponse(
            status_code=401,
            content={
                "detail": "Invalid credentials"
            },
        )