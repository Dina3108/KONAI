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


class PredictionValidation(Base):
    __tablename__ = "prediction_validations"

    id = Column(Integer, primary_key=True, index=True)

    prediction_id = Column(
        Integer,
        ForeignKey("predictions.id"),
        nullable=False,
        index=True
    )

    validation_result = Column(
        String(40),
        nullable=False
    )

    actual_condition = Column(Text, nullable=True)

    validation_notes = Column(Text, nullable=True)

    validated_by = Column(String(100), nullable=True)

    validated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True
    )