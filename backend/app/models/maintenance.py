from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    func,
)

from app.database import Base


class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)

    elevator_id = Column(
        Integer,
        ForeignKey("elevators.id"),
        nullable=False,
        index=True
    )

    incident_id = Column(
        Integer,
        ForeignKey("incidents.id"),
        nullable=True,
        index=True
    )

    work_order_code = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    maintenance_type = Column(
        String(100),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    priority = Column(
        String(30),
        nullable=False,
        default="Medium"
    )

    status = Column(
        String(40),
        nullable=False,
        default="Scheduled",
        index=True
    )

    assigned_to = Column(
        String(100),
        nullable=True
    )

    scheduled_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    started_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    completion_notes = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )