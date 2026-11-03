from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TelemetryCreate(BaseModel):
    sensor_id: int = Field(gt=0)
    value: float
    unit: str = Field(min_length=1, max_length=30)
    data_quality: str = Field(default="Valid", max_length=30)
    recorded_at: datetime | None = None


class TelemetryResponse(BaseModel):
    id: int
    sensor_id: int
    value: float
    unit: str
    data_quality: str
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)