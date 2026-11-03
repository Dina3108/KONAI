from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PredictionValidationCreate(BaseModel):
    prediction_id: int = Field(gt=0)

    validation_result: str = Field(
        min_length=2,
        max_length=40
    )

    actual_condition: str | None = None
    validation_notes: str | None = None
    validated_by: str | None = None


class PredictionValidationResponse(BaseModel):
    id: int
    prediction_id: int
    validation_result: str
    actual_condition: str | None
    validation_notes: str | None
    validated_by: str | None
    validated_at: datetime

    model_config = ConfigDict(from_attributes=True)