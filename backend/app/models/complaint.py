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


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    building_id = Column(
        Integer,
        ForeignKey("buildings.id"),
        nullable=False,
        index=True
    )

    elevator_id = Column(
        Integer,
        ForeignKey("elevators.id"),
        nullable=True,
        index=True
    )

    complaint_category = Column(
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
        default="Open",
        index=True
    )

    reported_by = Column(
        String(100),
        nullable=True
    )

    resolution_notes = Column(
        Text,
        nullable=True
    )

    reported_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True
    )

    resolved_at = Column(
        DateTime(timezone=True),
        nullable=True
    )