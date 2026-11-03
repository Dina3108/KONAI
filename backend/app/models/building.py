from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    building_code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100))
    region = Column(String(100))
    country = Column(String(100))
    building_type = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    elevators = relationship(
        "Elevator",
        back_populates="building",
        cascade="all, delete-orphan"
    )