from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.db.database import engine
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.farms import router as farms_router
from app.api.v1.crops import router as crops_router

from app.core.exception_handlers import register_exception_handlers
from app.core.config import settings

app = FastAPI(
    title="Kisaan AI Backend",
    version="1.0.0"
)

register_exception_handlers(app)

# CORS middleware — allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(farms_router)
app.include_router(crops_router)


@app.get("/")
def root():
    return {"message": "🚀 Kisaan AI Backend Running"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "error",
            "database": str(e)
        }