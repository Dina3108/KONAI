from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComplaintCreate(BaseModel):
    building_id: int = Field(gt=0)
    elevator_id: int | None = Field(default=None, gt=0)

    complaint_category: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5)

    priority: str = "Medium"
    reported_by: str | None = None


class ComplaintUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None
    resolution_notes: str | None = None


class ComplaintResponse(BaseModel):
    id: int
    building_id: int
    elevator_id: int | None
    complaint_category: str
    description: str
    priority: str
    status: str
    reported_by: str | None
    resolution_notes: str | None
    reported_at: datetime
    resolved_at: datetime | None

    model_config = ConfigDict(from_attributes=True)