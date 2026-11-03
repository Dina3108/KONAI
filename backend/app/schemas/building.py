from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class BuildingCreate(BaseModel):
    building_code: str = Field(min_length=2, max_length=50)
    name: str = Field(min_length=2, max_length=150)
    address: str = Field(min_length=3, max_length=255)
    city: str | None = None
    region: str | None = None
    country: str | None = None
    building_type: str | None = None


class BuildingUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=150)
    address: str | None = Field(default=None, max_length=255)
    city: str | None = None
    region: str | None = None
    country: str | None = None
    building_type: str | None = None


class BuildingResponse(BaseModel):
    id: int
    building_code: str
    name: str
    address: str
    city: str | None
    region: str | None
    country: str | None
    building_type: str | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)