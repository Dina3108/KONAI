from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    sensor_code = Column(String(50), unique=True, nullable=False, index=True)
    elevator_id = Column(Integer, ForeignKey("elevators.id"), nullable=False)

    sensor_type = Column(String(100), nullable=False)
    measurement_unit = Column(String(30))
    location = Column(String(100))
    is_active = Column(Boolean, default=True)
    calibration_date = Column(DateTime(timezone=True))

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    elevator = relationship("Elevator", back_populates="sensors")
    telemetry = relationship(
        "Telemetry",
        back_populates="sensor",
        cascade="all, delete-orphan"
    )