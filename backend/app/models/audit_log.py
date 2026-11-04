
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Text,
    ForeignKey,
    func,
    Index,
)

from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    # User who performed the action.
    # Keep the record even if the user is later deleted.
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    user_email = Column(String(255), nullable=True)
    user_role = Column(String(50), nullable=True)

    # Module and action details
    module = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)

    description = Column(Text, nullable=True)

    # Record affected by the action
    entity_type = Column(String(100), nullable=True)
    entity_id = Column(String(100), nullable=True)

    # Store sanitized before/after information as JSON text
    old_values = Column(Text, nullable=True)
    new_values = Column(Text, nullable=True)

    # Request information
    ip_address = Column(String(45), nullable=True)

    # SUCCESS or FAILURE
    status = Column(String(20), nullable=False, default="SUCCESS")

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )


Index(
    "ix_audit_logs_module_created",
    AuditLog.module,
    AuditLog.created_at,
)

Index(
    "ix_audit_logs_user_created",
    AuditLog.user_id,
    AuditLog.created_at,
)
