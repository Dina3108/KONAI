
import json
from datetime import date, datetime
from enum import Enum
from typing import Any, Optional

from fastapi import Request
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


# Fields that must never be included in audit snapshots.
SENSITIVE_FIELDS = {
    "password",
    "hashed_password",
    "access_token",
    "refresh_token",
    "token",
    "authorization",
    "secret",
    "secret_key",
    "jwt_secret_key",
    "api_key",
}


def sanitize_data(data: Any) -> Any:
    """
    Recursively remove sensitive fields and convert
    values into JSON-compatible data.
    """

    if isinstance(data, dict):
        cleaned = {}

        for key, value in data.items():
            if str(key).lower() in SENSITIVE_FIELDS:
                continue

            cleaned[str(key)] = sanitize_data(value)

        return cleaned

    if isinstance(data, (list, tuple)):
        return [sanitize_data(item) for item in data]

    if isinstance(data, (datetime, date)):
        return data.isoformat()

    if isinstance(data, Enum):
        return data.value

    if data is None or isinstance(data, (str, int, float, bool)):
        return data

    return str(data)


def serialize_snapshot(data: Optional[dict]) -> Optional[str]:
    """
    Convert a sanitized dictionary into JSON text.
    """

    if data is None:
        return None

    return json.dumps(
        sanitize_data(data),
        ensure_ascii=False,
        default=str,
    )


def record_audit_event(
    db: Session,
    *,
    module: str,
    action: str,
    description: Optional[str] = None,
    user: Any = None,
    user_email: Optional[str] = None,
    user_role: Optional[str] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[Any] = None,
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    request: Optional[Request] = None,
    status: str = "SUCCESS",
) -> AuditLog:
    """
    Add an audit event to the current database transaction.

    The calling router is responsible for committing or
    rolling back the transaction.
    """

    if status not in {"SUCCESS", "FAILURE"}:
        raise ValueError("Audit status must be SUCCESS or FAILURE.")

    if not module.strip():
        raise ValueError("Audit module cannot be empty.")

    if not action.strip():
        raise ValueError("Audit action cannot be empty.")

    if len(module) > 100 or len(action) > 100:
        raise ValueError("Audit module or action is too long.")

    resolved_user_email = user_email
    resolved_user_role = user_role
    resolved_user_id = None

    if user is not None:
        resolved_user_id = getattr(user, "id", None)
        resolved_user_email = (
            resolved_user_email or getattr(user, "email", None)
        )
        resolved_user_role = (
            resolved_user_role or getattr(user, "role", None)
        )

    ip_address = None

    if request is not None and request.client is not None:
        ip_address = request.client.host

    event = AuditLog(
        user_id=resolved_user_id,
        user_email=resolved_user_email,
        user_role=resolved_user_role,
        module=module,
        action=action,
        description=description,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else None,
        old_values=serialize_snapshot(old_values),
        new_values=serialize_snapshot(new_values),
        ip_address=ip_address,
        status=status,
    )

    db.add(event)

    return event
