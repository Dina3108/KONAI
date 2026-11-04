from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.telemetry import Telemetry
from app.models.sensor import Sensor
from app.schemas.telemetry import (
    TelemetryCreate,
    TelemetryResponse
)
from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/telemetry",
    tags=["Telemetry"]
)


READ_ROLES = [
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
]


# -------------------------------------------------
# 1. SUBMIT SENSOR READING - ADMINISTRATOR / ENGINEER
# -------------------------------------------------

@router.post("", response_model=TelemetryResponse, status_code=201)
def create_telemetry(
    data: TelemetryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("Administrator", "Technical Engineer")
    )
):
    sensor = db.query(Sensor).filter(
        Sensor.id == data.sensor_id
    ).first()

    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Associated sensor not found"
        )

    if not sensor.is_active:
        raise HTTPException(
            status_code=400,
            detail="Cannot submit readings for an inactive sensor"
        )

    telemetry = Telemetry(
        sensor_id=data.sensor_id,
        value=data.value,
        unit=data.unit,
        data_quality=data.data_quality,
        recorded_at=data.recorded_at or datetime.now(timezone.utc)
    )

    db.add(telemetry)
    db.commit()
    db.refresh(telemetry)

    return telemetry


# -------------------------------------------------
# 2. GET ALL TELEMETRY - ALL AUTHENTICATED ROLES
# -------------------------------------------------

@router.get("", response_model=list[TelemetryResponse])
def get_telemetry(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    sensor_id: int | None = Query(None, gt=0),
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(*READ_ROLES))
):
    if start_time and end_time and start_time > end_time:
        raise HTTPException(
            status_code=400,
            detail="start_time cannot be later than end_time"
        )

    query = db.query(Telemetry)

    if sensor_id is not None:
        query = query.filter(
            Telemetry.sensor_id == sensor_id
        )

    if start_time is not None:
        query = query.filter(
            Telemetry.recorded_at >= start_time
        )

    if end_time is not None:
        query = query.filter(
            Telemetry.recorded_at <= end_time
        )

    return (
        query
        .order_by(Telemetry.recorded_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# -------------------------------------------------
# 3. GET SENSOR TELEMETRY HISTORY - ALL ROLES
# -------------------------------------------------

@router.get(
    "/sensor/{sensor_id}",
    response_model=list[TelemetryResponse]
)
def get_sensor_telemetry(
    sensor_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(*READ_ROLES))
):
    sensor = db.query(Sensor).filter(
        Sensor.id == sensor_id
    ).first()

    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )

    return (
        db.query(Telemetry)
        .filter(Telemetry.sensor_id == sensor_id)
        .order_by(Telemetry.recorded_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# -------------------------------------------------
# 4. GET LATEST SENSOR READING - ALL ROLES
# -------------------------------------------------

@router.get(
    "/sensor/{sensor_id}/latest",
    response_model=TelemetryResponse
)
def get_latest_telemetry(
    sensor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(*READ_ROLES))
):
    sensor = db.query(Sensor).filter(
        Sensor.id == sensor_id
    ).first()

    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )

    reading = (
        db.query(Telemetry)
        .filter(Telemetry.sensor_id == sensor_id)
        .order_by(Telemetry.recorded_at.desc())
        .first()
    )

    if not reading:
        raise HTTPException(
            status_code=404,
            detail="No telemetry readings found for this sensor"
        )

    return reading