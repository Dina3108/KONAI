
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class SensorCreate(BaseModel):
    sensor_code: str = Field(min_length=2, max_length=50)
    elevator_id: int = Field(gt=0)
    sensor_type: str = Field(min_length=2, max_length=100)
    measurement_unit: str | None = None
    location: str | None = None
    is_active: bool = True
    calibration_date: datetime | None = None


class SensorUpdate(BaseModel):
    sensor_type: str | None = None
    measurement_unit: str | None = None
    location: str | None = None
    is_active: bool | None = None
    calibration_date: datetime | None = None


class SensorResponse(BaseModel):
    id: int
    sensor_code: str
    elevator_id: int
    sensor_type: str
    measurement_unit: str | None
    location: str | None
    is_active: bool
    calibration_date: datetime | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
