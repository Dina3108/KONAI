from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ElevatorCreate(BaseModel):
    elevator_code: str = Field(min_length=2, max_length=50)
    building_id: int = Field(gt=0)
    model: str | None = None
    elevator_type: str | None = None
    manufacturer: str = "KONE"
    floors_served: int | None = Field(default=None, gt=0)
    installation_date: datetime | None = None
    operational_status: str = "Operational"
    health_status: str = "Healthy"


class ElevatorUpdate(BaseModel):
    building_id: int | None = Field(default=None, gt=0)
    model: str | None = None
    elevator_type: str | None = None
    manufacturer: str | None = None
    floors_served: int | None = Field(default=None, gt=0)
    installation_date: datetime | None = None
    operational_status: str | None = None
    health_status: str | None = None


class ElevatorResponse(BaseModel):
    id: int
    elevator_code: str
    building_id: int
    model: str | None
    elevator_type: str | None
    manufacturer: str | None
    floors_served: int | None
    installation_date: datetime | None
    operational_status: str | None
    health_status: str | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)