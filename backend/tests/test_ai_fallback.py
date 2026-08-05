from unittest.mock import patch

from app.schemas.ai import AIQuery
from app.services.ai_service import AIService


def test_ai_fallback_on_api_error():
    """When Gemini API fails, should return usable keyword-based fallback."""
    query = AIQuery(question="When to spray tomato?")

    with patch("app.services.ai_service.AIService._get_client") as mock_client:
        mock_client.return_value.models.generate_content.side_effect = Exception(
            "429 RESOURCE_EXHAUSTED"
        )

        response = AIService.ask(query)

        assert response.problem == "Pest or disease on crops"
        assert response.confidence > 0
        assert response.action


def test_ai_fallback_water():
    query = AIQuery(question="How often should I water my wheat?")

    with patch("app.services.ai_service.AIService._get_client") as mock_client:
        mock_client.return_value.models.generate_content.side_effect = Exception(
            "API error"
        )

        response = AIService.ask(query)

        assert response.confidence > 0
        assert response.action


def test_ai_fallback_harvest():
    query = AIQuery(question="Is my wheat ready to harvest?")

    with patch("app.services.ai_service.AIService._get_client") as mock_client:
        mock_client.return_value.models.generate_content.side_effect = Exception(
            "API error"
        )

        response = AIService.ask(query)

        assert response.confidence > 0
        assert response.action


def test_ai_fallback_generic():
    query = AIQuery(question="What should I plant next season?")

    with patch("app.services.ai_service.AIService._get_client") as mock_client:
        mock_client.return_value.models.generate_content.side_effect = Exception(
            "API error"
        )

        response = AIService.ask(query)

        assert response.confidence > 0
        assert response.action
