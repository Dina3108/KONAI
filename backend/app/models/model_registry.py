from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    UniqueConstraint,
    func,
)

from app.database import Base


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    __table_args__ = (
        UniqueConstraint(
            "model_name",
            "model_version",
            name="uq_model_name_version"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    model_name = Column(
        String(100),
        nullable=False,
        index=True
    )

    model_version = Column(
        String(50),
        nullable=False
    )

    model_type = Column(
        String(100),
        nullable=False
    )

    framework = Column(
        String(100),
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    model_file_uri = Column(
        Text,
        nullable=True
    )

    deployment_status = Column(
        String(30),
        nullable=False,
        default="Registered",
        index=True
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=False
    )

    accuracy = Column(Float, nullable=True)
    precision_score = Column(Float, nullable=True)
    recall_score = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    inference_latency_ms = Column(Float, nullable=True)

    trained_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    deployed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )