from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.sensor import Sensor
from app.models.elevator import Elevator
from app.models.telemetry import Telemetry
from app.schemas.sensor import (
    SensorCreate,
    SensorUpdate,
    SensorResponse
)
from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/sensors",
    tags=["Sensors"]
)


# -------------------------------------------------
# 1. CREATE SENSOR - ADMINISTRATOR ONLY
# -------------------------------------------------

@router.post("", response_model=SensorResponse, status_code=201)
def create_sensor(
    data: SensorCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Administrator"))
):
    elevator = db.query(Elevator).filter(
        Elevator.id == data.elevator_id
    ).first()

    if not elevator:
        raise HTTPException(
            status_code=404,
            detail="Associated elevator not found"
        )

    existing = db.query(Sensor).filter(
        Sensor.sensor_code == data.sensor_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Sensor code already exists"
        )

    sensor = Sensor(**data.model_dump())
    db.add(sensor)

    try:
        db.commit()
        db.refresh(sensor)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not create sensor because of a database conflict"
        )

    return sensor


# -------------------------------------------------
# 2. GET ALL SENSORS - ALL AUTHENTICATED ROLES
# -------------------------------------------------

@router.get("", response_model=list[SensorResponse])
def get_sensors(
    skip: int = 0,
    limit: int = 100,
    elevator_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Administrator",
            "Technical Engineer",
            "Regional Manager",
            "Viewer"
        )
    )
):
    if skip < 0 or limit < 1 or limit > 500:
        raise HTTPException(
            status_code=400,
            detail="Use skip >= 0 and limit between 1 and 500"
        )

    query = db.query(Sensor)

    if elevator_id is not None:
        query = query.filter(
            Sensor.elevator_id == elevator_id
        )

    return (
        query.order_by(Sensor.id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# -------------------------------------------------
# 3. GET SENSOR BY ID - ALL AUTHENTICATED ROLES
# -------------------------------------------------

@router.get("/{sensor_id}", response_model=SensorResponse)
def get_sensor(
    sensor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Administrator",
            "Technical Engineer",
            "Regional Manager",
            "Viewer"
        )
    )
):
    sensor = db.query(Sensor).filter(
        Sensor.id == sensor_id
    ).first()

    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )

    return sensor


# -------------------------------------------------
# 4. UPDATE SENSOR - ADMINISTRATOR / ENGINEER
# -------------------------------------------------

@router.put("/{sensor_id}", response_model=SensorResponse)
def update_sensor(
    sensor_id: int,
    data: SensorUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Administrator",
            "Technical Engineer"
        )
    )
):
    sensor = db.query(Sensor).filter(
        Sensor.id == sensor_id
    ).first()

    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )

    updates = data.model_dump(
        exclude_unset=True,
        exclude_none=True
    )

    for field, value in updates.items():
        setattr(sensor, field, value)

    try:
        db.commit()
        db.refresh(sensor)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not update sensor"
        )

    return sensor


# -------------------------------------------------
# 5. DELETE SENSOR - ADMINISTRATOR ONLY
# -------------------------------------------------

@router.delete("/{sensor_id}")
def delete_sensor(
    sensor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Administrator"))
):
    sensor = db.query(Sensor).filter(
        Sensor.id == sensor_id
    ).first()

    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )

    telemetry_exists = db.query(Telemetry).filter(
        Telemetry.sensor_id == sensor_id
    ).first()

    if telemetry_exists:
        raise HTTPException(
            status_code=409,
            detail="Sensor has telemetry history. Deactivate it instead of deleting it."
        )

    db.delete(sensor)
    db.commit()

    return {
        "message": "Sensor deleted successfully",
        "sensor_id": sensor_id
    }