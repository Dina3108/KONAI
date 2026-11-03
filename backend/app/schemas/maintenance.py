from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MaintenanceCreate(BaseModel):
    elevator_id: int = Field(gt=0)
    incident_id: int | None = Field(default=None, gt=0)

    work_order_code: str = Field(min_length=3, max_length=50)
    maintenance_type: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5)

    priority: str = "Medium"
    assigned_to: str | None = None
    scheduled_at: datetime | None = None


class MaintenanceUpdate(BaseModel):
    priority: str | None = None
    status: str | None = None
    assigned_to: str | None = None
    scheduled_at: datetime | None = None
    completion_notes: str | None = None


class MaintenanceResponse(BaseModel):
    id: int
    elevator_id: int
    incident_id: int | None
    work_order_code: str
    maintenance_type: str
    description: str
    priority: str
    status: str
    assigned_to: str | None
    scheduled_at: datetime | None
    started_at: datetime | None
    completed_at: datetime | None
    completion_notes: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)