
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.maintenance import Maintenance
from app.models.elevator import Elevator
from app.models.incident import Incident

from app.schemas.maintenance import (
    MaintenanceCreate,
    MaintenanceUpdate,
    MaintenanceResponse
)

from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/maintenance",
    tags=["Maintenance Engineering"]
)


READ_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
)

MAINTENANCE_MANAGEMENT_ROLES = (
    "Administrator",
    "Technical Engineer"
)

ALLOWED_PRIORITIES = ["Low", "Medium", "High", "Critical"]

ALLOWED_STATUSES = [
    "Scheduled",
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled"
]


# 1. Create a maintenance work order
# Administrator and Technical Engineer
@router.post(
    "",
    response_model=MaintenanceResponse,
    status_code=201,
    dependencies=[
        Depends(require_roles(*MAINTENANCE_MANAGEMENT_ROLES))
    ]
)
def create_maintenance(
    data: MaintenanceCreate,
    db: Session = Depends(get_db)
):

    elevator = db.query(Elevator).filter(
        Elevator.id == data.elevator_id
    ).first()

    if not elevator:
        raise HTTPException(
            status_code=404,
            detail="Associated elevator not found"
        )

    if data.incident_id is not None:
        incident = db.query(Incident).filter(
            Incident.id == data.incident_id
        ).first()

        if not incident:
            raise HTTPException(
                status_code=404,
                detail="Associated incident not found"
            )

        if incident.elevator_id != data.elevator_id:
            raise HTTPException(
                status_code=400,
                detail="Incident does not belong to the specified elevator"
            )

    if data.priority not in ALLOWED_PRIORITIES:
        raise HTTPException(
            status_code=400,
            detail="Invalid maintenance priority"
        )

    existing = db.query(Maintenance).filter(
        Maintenance.work_order_code == data.work_order_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Work order code already exists"
        )

    maintenance = Maintenance(**data.model_dump())

    db.add(maintenance)

    try:
        db.commit()
        db.refresh(maintenance)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not create maintenance work order"
        )

    return maintenance


# 2. Retrieve work orders with optional filters
# All authenticated roles
@router.get(
    "",
    response_model=list[MaintenanceResponse],
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_maintenance_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    elevator_id: int | None = Query(None, gt=0),
    priority: str | None = None,
    status: str | None = None,
    assigned_to: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Maintenance)

    if elevator_id is not None:
        query = query.filter(
            Maintenance.elevator_id == elevator_id
        )

    if priority is not None:
        if priority not in ALLOWED_PRIORITIES:
            raise HTTPException(
                status_code=400,
                detail="Invalid priority filter"
            )

        query = query.filter(
            Maintenance.priority == priority
        )

    if status is not None:
        if status not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid status filter"
            )

        query = query.filter(
            Maintenance.status == status
        )

    if assigned_to:
        query = query.filter(
            Maintenance.assigned_to == assigned_to
        )

    return (
        query
        .order_by(Maintenance.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# 3. Retrieve one work order
# All authenticated roles
@router.get(
    "/{maintenance_id}",
    response_model=MaintenanceResponse,
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db)
):

    record = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Maintenance work order not found"
        )

    return record


# 4. Update work order and maintenance progress
# Administrator and Technical Engineer
@router.patch(
    "/{maintenance_id}",
    response_model=MaintenanceResponse,
    dependencies=[
        Depends(require_roles(*MAINTENANCE_MANAGEMENT_ROLES))
    ]
)
def update_maintenance(
    maintenance_id: int,
    data: MaintenanceUpdate,
    db: Session = Depends(get_db)
):

    record = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Maintenance work order not found"
        )

    updates = data.model_dump(exclude_unset=True)

    if updates.get("priority") is not None:
        if updates["priority"] not in ALLOWED_PRIORITIES:
            raise HTTPException(
                status_code=400,
                detail="Invalid maintenance priority"
            )

    if updates.get("status") is not None:
        new_status = updates["status"]

        if new_status not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid maintenance status"
            )

        if new_status == "In Progress" and record.started_at is None:
            record.started_at = datetime.now(timezone.utc)

        if new_status == "Completed":
            if record.status != "Completed":
                record.completed_at = datetime.now(timezone.utc)

            if not updates.get("completion_notes") and not record.completion_notes:
                raise HTTPException(
                    status_code=400,
                    detail="Completion notes are required before completing the work order"
                )

        elif new_status != "Completed":
            record.completed_at = None

    for field, value in updates.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)

    return record
