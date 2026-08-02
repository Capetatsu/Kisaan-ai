from pydantic import BaseModel, ConfigDict


class FarmCreate(BaseModel):
    name: str
    soil_type: str
    area: float
    latitude: float
    longitude: float


class FarmUpdate(BaseModel):
    name: str
    soil_type: str
    area: float
    latitude: float
    longitude: float


class FarmResponse(BaseModel):
    id: int
    name: str
    soil_type: str
    area: float
    latitude: float
    longitude: float

    model_config = ConfigDict(from_attributes=True)