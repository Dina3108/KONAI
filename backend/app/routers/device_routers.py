
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.device import Device
from app.models.elevator import Elevator
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceResponse
from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/devices",
    tags=["Devices & Hardware"]
)


READ_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
)


# 1. Register a hardware device - Administrator only
@router.post(
    "",
    response_model=DeviceResponse,
    status_code=201,
    dependencies=[Depends(require_roles("Administrator"))]
)
def create_device(data: DeviceCreate, db: Session = Depends(get_db)):

    if data.elevator_id is not None:
        elevator = db.query(Elevator).filter(
            Elevator.id == data.elevator_id
        ).first()

        if not elevator:
            raise HTTPException(
                status_code=404,
                detail="Associated elevator not found"
            )

    existing = db.query(Device).filter(
        Device.device_code == data.device_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Device code already exists"
        )

    device = Device(**data.model_dump())

    db.add(device)

    try:
        db.commit()
        db.refresh(device)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not register device because of a database conflict"
        )

    return device


# 2. List devices - All authenticated roles
@router.get(
    "",
    response_model=list[DeviceResponse],
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_devices(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    elevator_id: int | None = Query(None, gt=0),
    connectivity_status: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Device)

    if elevator_id is not None:
        query = query.filter(Device.elevator_id == elevator_id)

    if connectivity_status:
        query = query.filter(
            Device.connectivity_status == connectivity_status
        )

    return (
        query
        .order_by(Device.id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# 3. Retrieve one device - All authenticated roles
@router.get(
    "/{device_id}",
    response_model=DeviceResponse,
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_device(device_id: int, db: Session = Depends(get_db)):

    device = db.query(Device).filter(
        Device.id == device_id
    ).first()

    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    return device


# 4. Update device - Administrator and Technical Engineer
@router.put(
    "/{device_id}",
    response_model=DeviceResponse,
    dependencies=[
        Depends(require_roles("Administrator", "Technical Engineer"))
    ]
)
def update_device(
    device_id: int,
    data: DeviceUpdate,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.id == device_id
    ).first()

    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    updates = data.model_dump(exclude_unset=True)

    if "elevator_id" in updates and updates["elevator_id"] is not None:
        elevator = db.query(Elevator).filter(
            Elevator.id == updates["elevator_id"]
        ).first()

        if not elevator:
            raise HTTPException(
                status_code=404,
                detail="Associated elevator not found"
            )

    for field, value in updates.items():
        setattr(device, field, value)

    try:
        db.commit()
        db.refresh(device)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not update device"
        )

    return device


# 5. Deactivate device - Administrator only
@router.delete(
    "/{device_id}",
    dependencies=[Depends(require_roles("Administrator"))]
)
def deactivate_device(
    device_id: int,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.id == device_id
    ).first()

    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    device.is_active = False

    db.commit()

    return {
        "message": "Device deactivated successfully",
        "device_id": device_id,
        "is_active": False
    }
