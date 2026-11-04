
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.audit import AuditLogResponse
from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/audit",
    tags=["Audit & Activity"],
)


@router.get(
    "",
    response_model=list[AuditLogResponse],
)
def get_audit_logs(
    module: Optional[str] = Query(default=None, max_length=100),
    action: Optional[str] = Query(default=None, max_length=100),
    event_status: Optional[str] = Query(
        default=None,
        alias="status",
        pattern="^(SUCCESS|FAILURE)$",
    ),
    search: Optional[str] = Query(default=None, max_length=255),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles("Administrator")),
):
    query = db.query(AuditLog)

    if module:
        query = query.filter(AuditLog.module == module)

    if action:
        query = query.filter(AuditLog.action == action)

    if event_status:
        query = query.filter(AuditLog.status == event_status)

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            (AuditLog.user_email.ilike(term))
            | (AuditLog.description.ilike(term))
            | (AuditLog.entity_type.ilike(term))
            | (AuditLog.entity_id.ilike(term))
        )

    return (
        query.order_by(
            AuditLog.created_at.desc(),
            AuditLog.id.desc(),
        )
        .offset(offset)
        .limit(limit)
        .all()
    )
