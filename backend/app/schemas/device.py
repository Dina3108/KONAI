from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DeviceCreate(BaseModel):
    device_code: str = Field(min_length=2, max_length=50)
    elevator_id: int | None = Field(default=None, gt=0)
    device_name: str = Field(min_length=2, max_length=100)
    device_type: str = Field(min_length=2, max_length=100)
    firmware_version: str | None = None
    connectivity_status: str = "Unknown"
    cpu_usage: int | None = Field(default=None, ge=0, le=100)
    temperature: int | None = None
    storage_usage: int | None = Field(default=None, ge=0, le=100)
    last_communication: datetime | None = None
    is_active: bool = True


class DeviceUpdate(BaseModel):
    elevator_id: int | None = Field(default=None, gt=0)
    device_name: str | None = Field(default=None, min_length=2, max_length=100)
    device_type: str | None = Field(default=None, min_length=2, max_length=100)
    firmware_version: str | None = None
    connectivity_status: str | None = None
    cpu_usage: int | None = Field(default=None, ge=0, le=100)
    temperature: int | None = None
    storage_usage: int | None = Field(default=None, ge=0, le=100)
    last_communication: datetime | None = None
    is_active: bool | None = None


class DeviceResponse(BaseModel):
    id: int
    device_code: str
    elevator_id: int | None
    device_name: str
    device_type: str
    firmware_version: str | None
    connectivity_status: str
    cpu_usage: int | None
    temperature: int | None
    storage_usage: int | None
    last_communication: datetime | None
    is_active: bool
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)