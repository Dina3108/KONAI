from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ModelRegistryCreate(BaseModel):
    model_name: str = Field(min_length=2, max_length=100)
    model_version: str = Field(min_length=1, max_length=50)
    model_type: str = Field(min_length=2, max_length=100)

    framework: str | None = None
    description: str | None = None
    model_file_uri: str | None = None

    deployment_status: str = "Registered"

    accuracy: float | None = Field(default=None, ge=0, le=1)
    precision_score: float | None = Field(default=None, ge=0, le=1)
    recall_score: float | None = Field(default=None, ge=0, le=1)
    f1_score: float | None = Field(default=None, ge=0, le=1)
    inference_latency_ms: float | None = Field(default=None, ge=0)

    trained_at: datetime | None = None


class ModelRegistryUpdate(BaseModel):
    framework: str | None = None
    description: str | None = None
    model_file_uri: str | None = None

    deployment_status: str | None = None

    accuracy: float | None = Field(default=None, ge=0, le=1)
    precision_score: float | None = Field(default=None, ge=0, le=1)
    recall_score: float | None = Field(default=None, ge=0, le=1)
    f1_score: float | None = Field(default=None, ge=0, le=1)
    inference_latency_ms: float | None = Field(default=None, ge=0)

    trained_at: datetime | None = None


class ModelRegistryResponse(BaseModel):
    id: int
    model_name: str
    model_version: str
    model_type: str
    framework: str | None
    description: str | None
    model_file_uri: str | None
    deployment_status: str
    is_active: bool
    accuracy: float | None
    precision_score: float | None
    recall_score: float | None
    f1_score: float | None
    inference_latency_ms: float | None
    trained_at: datetime | None
    deployed_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)