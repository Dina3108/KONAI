from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Elevator(Base):
    __tablename__ = "elevators"

    id = Column(Integer, primary_key=True, index=True)
    elevator_code = Column(String(50), unique=True, nullable=False, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)

    model = Column(String(100))
    elevator_type = Column(String(100))
    manufacturer = Column(String(100), default="KONE")
    floors_served = Column(Integer)
    installation_date = Column(DateTime(timezone=True))
    operational_status = Column(String(50), default="Operational")
    health_status = Column(String(50), default="Healthy")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    building = relationship("Building", back_populates="elevators")
    sensors = relationship(
        "Sensor",
        back_populates="elevator",
        cascade="all, delete-orphan"
    )
    devices = relationship(
        "Device",
        back_populates="elevator",
        cascade="all, delete-orphan"
    )