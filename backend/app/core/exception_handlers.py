from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions import (
    UserAlreadyExistsException,
    InvalidCredentialsException,
    FarmNotFoundException,
    CropNotFoundException,
    ForbiddenException,
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

    @app.exception_handler(FarmNotFoundException)
    async def farm_not_found_handler(
        request: Request,
        exc: FarmNotFoundException,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "detail": "Farm not found"
            },
        )

    @app.exception_handler(CropNotFoundException)
    async def crop_not_found_handler(
        request: Request,
        exc: CropNotFoundException,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "detail": "Crop not found"
            },
        )

    @app.exception_handler(ForbiddenException)
    async def forbidden_handler(
        request: Request,
        exc: ForbiddenException,
    ):
        return JSONResponse(
            status_code=403,
            content={
                "detail": "Forbidden"
            },
        )