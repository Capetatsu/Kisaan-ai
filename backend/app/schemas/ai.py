from pydantic import BaseModel


class AIQuery(BaseModel):
    question: str
    language: str = "en"
    crop_name: str | None = None
    farm_id: int | None = None


class AIResponse(BaseModel):
    problem: str
    reason: str
    action: str
    confidence: int
    scheme: str | None = None