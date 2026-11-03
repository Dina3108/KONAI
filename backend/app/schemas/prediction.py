from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PredictionCreate(BaseModel):
    elevator_id: int = Field(gt=0)
    prediction_type: str = Field(min_length=2, max_length=100)
    anomaly_score: float | None = Field(default=None, ge=0, le=1)
    severity: str = "Info"
    explanation: str = Field(min_length=3)
    recommended_action: str | None = None
    model_name: str | None = None
    model_version: str | None = None
    prediction_status: str = "Open"


class PredictionStatusUpdate(BaseModel):
    prediction_status: str = Field(min_length=2, max_length=30)


class PredictionResponse(BaseModel):
    id: int
    elevator_id: int
    prediction_type: str
    anomaly_score: float | None
    severity: str
    explanation: str
    recommended_action: str | None
    model_name: str | None
    model_version: str | None
    prediction_status: str
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)