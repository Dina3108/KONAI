from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class IncidentCreate(BaseModel):
    elevator_id: int = Field(gt=0)
    complaint_id: int | None = Field(default=None, gt=0)
    prediction_id: int | None = Field(default=None, gt=0)

    incident_type: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5)

    severity: str = "Medium"
    assigned_to: str | None = None


class IncidentUpdate(BaseModel):
    severity: str | None = None
    status: str | None = None
    assigned_to: str | None = None
    investigation_notes: str | None = None
    resolution_notes: str | None = None


class IncidentResponse(BaseModel):
    id: int
    elevator_id: int
    complaint_id: int | None
    prediction_id: int | None
    incident_type: str
    description: str
    severity: str
    status: str
    assigned_to: str | None
    investigation_notes: str | None
    resolution_notes: str | None
    detected_at: datetime
    resolved_at: datetime | None

    model_config = ConfigDict(from_attributes=True)