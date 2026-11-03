from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey,
    func,
)

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    elevator_id = Column(
        Integer,
        ForeignKey("elevators.id"),
        nullable=False,
        index=True
    )

    prediction_type = Column(String(100), nullable=False)

    anomaly_score = Column(Float, nullable=True)

    severity = Column(
        String(30),
        nullable=False,
        default="Info"
    )

    explanation = Column(Text, nullable=False)

    recommended_action = Column(Text, nullable=True)

    model_name = Column(String(100), nullable=True)

    model_version = Column(String(50), nullable=True)

    prediction_status = Column(
        String(30),
        nullable=False,
        default="Open"
    )

    generated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True
    )