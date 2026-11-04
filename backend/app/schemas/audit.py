
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    user_role: Optional[str] = None

    module: str
    action: str
    description: Optional[str] = None

    entity_type: Optional[str] = None
    entity_id: Optional[str] = None

    old_values: Optional[str] = None
    new_values: Optional[str] = None

    ip_address: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
