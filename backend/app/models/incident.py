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


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    elevator_id = Column(
        Integer,
        ForeignKey("elevators.id"),
        nullable=False,
        index=True
    )

    complaint_id = Column(
        Integer,
        ForeignKey("complaints.id"),
        nullable=True
    )

    prediction_id = Column(
        Integer,
        ForeignKey("predictions.id"),
        nullable=True
    )

    incident_type = Column(
        String(100),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    severity = Column(
        String(30),
        nullable=False,
        default="Medium"
    )

    status = Column(
        String(40),
        nullable=False,
        default="Open",
        index=True
    )

    assigned_to = Column(
        String(100),
        nullable=True
    )

    investigation_notes = Column(
        Text,
        nullable=True
    )

    resolution_notes = Column(
        Text,
        nullable=True
    )

    detected_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True
    )

    resolved_at = Column(
        DateTime(timezone=True),
        nullable=True
    )