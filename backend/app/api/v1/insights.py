from fastapi import APIRouter, Depends, Query

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.ai import AIQuery, AIResponse
from app.services.ai_service import AIService
from app.services.market_service import MarketService
from app.services.weather_service import WeatherService

router = APIRouter(
    prefix="/insights",
    tags=["Insights"],
)


@router.post(
    "/ai/ask",
    response_model=AIResponse,
)
def ask_ai(
    query: AIQuery,
    current_user: User = Depends(get_current_user),
):
    """Ask the Gemini-powered farm advisor a question."""
    return AIService.ask(query)


@router.get(
    "/weather",
)
def get_weather(
    latitude: float | None = Query(None),
    longitude: float | None = Query(None),
    current_user: User = Depends(get_current_user),
):
    """Get current weather for farm location."""
    return WeatherService.get_weather(latitude, longitude)


@router.get(
    "/market/prices",
)
def get_market_prices(
    current_user: User = Depends(get_current_user),
):
    """Get current mandi prices."""
    return MarketService.get_market_prices()


@router.get(
    "/market/mandi",
)
def get_nearby_mandi(
    current_user: User = Depends(get_current_user),
):
    """Get nearby mandi information."""
    return MarketService.get_nearby_mandi()