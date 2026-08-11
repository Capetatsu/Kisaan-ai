import json
import re

from google import genai

from app.core.config import settings
from app.schemas.ai import AIQuery, AIResponse


class AIService:

    @staticmethod
    def _get_client():
        return genai.Client(api_key=settings.GEMINI_API_KEY)

    @staticmethod
    def _build_prompt(query: AIQuery) -> str:
        lang_name = {
            "en": "English",
            "hi": "Hindi",
            "mr": "Marathi",
            "gu": "Gujarati",
            "ta": "Tamil",
            "te": "Telugu",
            "bn": "Bengali",
        }.get(query.language, "English")

        crop_context = f" The crop in question is: {query.crop_name}." if query.crop_name else ""

        return f"""
You are Kisaan AI, an expert agricultural advisor for Indian farmers.
You provide practical, actionable advice in simple language.

The farmer asks: "{query.question}"
{crop_context}

Respond in {lang_name} with a JSON object (no markdown, no code fences) in this exact format:
{{
  "problem": "Short description of the issue",
  "reason": "Likely cause",
  "action": "Clear step-by-step action the farmer should take",
  "confidence": 85,
  "scheme": "Relevant Indian government scheme if applicable, otherwise null"
}}

Rules:
- Keep each field under 200 characters.
- Confidence is an integer 0-100.
- If a government scheme (PM-KISAN, PM-AASHA, PMFBY, KCC, etc.) applies, include it; otherwise null.
- Use simple, practical language a rural farmer would understand.
"""

    @staticmethod
    def _parse_response(text: str) -> AIResponse:
        # Strip markdown code fences if present
        text = re.sub(r"```(?:json)?", "", text).strip()

        # Find the JSON object
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise ValueError("No JSON found in AI response")

        data = json.loads(match.group())

        return AIResponse(
            problem=data.get("problem", "No problem identified"),
            reason=data.get("reason", "Unknown cause"),
            action=data.get("action", "Consult a local agricultural officer"),
            confidence=int(data.get("confidence", 70)),
            scheme=data.get("scheme"),
        )

    @staticmethod
    def _fallback_response(query: AIQuery) -> AIResponse:
        """Return a pragmatic fallback answer when Gemini is unavailable."""
        question = query.question.lower()

        # Keyword-based fallback advice
        if any(k in question for k in ["spray", "पत्ती", "कीट", "pest", "insect"]):
            return AIResponse(
                problem="Pest or disease on crops",
                reason="Common pests like whitefly or aphids may be present",
                action="Inspect leaves early morning. Use neem oil spray first; if severe, consult your KVK for recommended pesticide.",
                confidence=75,
                scheme="PM-KISAN",
            )
        if any(k in question for k in ["water", "सिंचाई", "irrigat", "पानी"]):
            return AIResponse(
                problem="Crop water need",
                reason="Soil moisture may be insufficient",
                action="Check soil moisture by pressing soil in hand. Irrigate in early morning or evening to reduce evaporation.",
                confidence=80,
                scheme=None,
            )
        if any(k in question for k in ["harvest", "कटाई", "कब"]):
            return AIResponse(
                problem="Harvest timing",
                reason="Crop maturity stage needs assessment",
                action="Check grain moisture. Harvest when moisture is 12-14% to avoid losses. Store in dry, clean bags.",
                confidence=78,
                scheme="PM-AASHA",
            )
        if any(k in question for k in ["fertil", "खाद", "उर्वरक"]):
            return AIResponse(
                problem="Fertilizer application",
                reason="Nutrient requirement varies by crop stage",
                action="Get soil tested at your nearest soil testing lab. Apply fertilizer based on soil test report for best yields.",
                confidence=70,
                scheme="PM-KISAN",
            )
        if any(k in question for k in ["price", "भाव", "मंडी", "sell", "बेच"]):
            return AIResponse(
                problem="Market price inquiry",
                reason="Mandi prices fluctuate daily",
                action="Check today's mandi rates on the Market page. Compare prices across nearby mandis before selling.",
                confidence=82,
                scheme=None,
            )

        # Generic fallback
        return AIResponse(
            problem="Need more information about your crop",
            reason="The AI advisor needs more context about your specific situation",
            action="Please provide more details about your crop, stage, and the issue you are facing.",
            confidence=60,
            scheme=None,
        )

    @staticmethod
    def ask(query: AIQuery) -> AIResponse:
        if not settings.GEMINI_API_KEY:
            return AIService._fallback_response(query)

        client = AIService._get_client()
        prompt = AIService._build_prompt(query)

        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt,
            )

            return AIService._parse_response(response.text)

        except Exception:
            # Handle rate limits, quota issues, network errors — return useful fallback
            return AIService._fallback_response(query)
