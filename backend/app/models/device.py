from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    device_code = Column(String(50), unique=True, nullable=False, index=True)
    elevator_id = Column(Integer, ForeignKey("elevators.id"), nullable=True)

    device_name = Column(String(150), nullable=False)
    device_type = Column(String(100))
    firmware_version = Column(String(50))
    connectivity_status = Column(String(50), default="Unknown")
    cpu_usage = Column(Integer)
    temperature = Column(Integer)
    storage_usage = Column(Integer)
    last_communication = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    elevator = relationship("Elevator", back_populates="devices")