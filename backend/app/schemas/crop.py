from datetime import date
from pydantic import BaseModel, ConfigDict

from app.models.crop import CropSeason, CropStatus


class CropCreate(BaseModel):
    name: str
    variety: str | None = None
    season: CropSeason
    planted_at: date
    expected_harvest: date | None = None
    status: CropStatus = CropStatus.PLANTED


class CropUpdate(BaseModel):
    name: str | None = None
    variety: str | None = None
    season: CropSeason | None = None
    planted_at: date | None = None
    expected_harvest: date | None = None
    status: CropStatus | None = None


class CropResponse(BaseModel):
    id: int
    farm_id: int
    name: str
    variety: str | None
    season: CropSeason
    planted_at: date
    expected_harvest: date | None
    status: CropStatus

    model_config = ConfigDict(from_attributes=True)