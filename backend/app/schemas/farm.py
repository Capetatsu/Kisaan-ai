from pydantic import BaseModel, ConfigDict


class FarmCreate(BaseModel):
    name: str
    soil_type: str
    area: float
    latitude: float
    longitude: float


class FarmUpdate(BaseModel):
    name: str | None = None
    soil_type: str | None = None
    area: float | None = None
    latitude: float | None = None
    longitude: float | None = None


class FarmResponse(BaseModel):
    id: int
    name: str
    soil_type: str
    area: float
    latitude: float
    longitude: float

    model_config = ConfigDict(from_attributes=True)