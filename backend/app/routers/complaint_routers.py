from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.complaint import Complaint
from app.models.building import Building
from app.models.elevator import Elevator
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintUpdate,
    ComplaintResponse
)


router = APIRouter(
    prefix="/api/v1/complaints",
    tags=["Complaints & Compliance"]
)


ALLOWED_PRIORITIES = ["Low", "Medium", "High", "Critical"]

ALLOWED_STATUSES = [
    "Open",
    "Under Investigation",
    "Resolved",
    "Closed"
]


# 1. Register a complaint
@router.post("", response_model=ComplaintResponse, status_code=201)
def create_complaint(
    data: ComplaintCreate,
    db: Session = Depends(get_db)
):

    building = db.query(Building).filter(
        Building.id == data.building_id
    ).first()

    if not building:
        raise HTTPException(
            status_code=404,
            detail="Associated building not found"
        )

    if data.elevator_id is not None:
        elevator = db.query(Elevator).filter(
            Elevator.id == data.elevator_id
        ).first()

        if not elevator:
            raise HTTPException(
                status_code=404,
                detail="Associated elevator not found"
            )

        if elevator.building_id != data.building_id:
            raise HTTPException(
                status_code=400,
                detail="Elevator does not belong to the specified building"
            )

    if data.priority not in ALLOWED_PRIORITIES:
        raise HTTPException(
            status_code=400,
            detail="Invalid complaint priority"
        )

    complaint = Complaint(**data.model_dump())

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint


# 2. Retrieve complaints with filters
@router.get("", response_model=list[ComplaintResponse])
def get_complaints(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    building_id: int | None = Query(None, gt=0),
    elevator_id: int | None = Query(None, gt=0),
    priority: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Complaint)

    if building_id is not None:
        query = query.filter(
            Complaint.building_id == building_id
        )

    if elevator_id is not None:
        query = query.filter(
            Complaint.elevator_id == elevator_id
        )

    if priority is not None:
        if priority not in ALLOWED_PRIORITIES:
            raise HTTPException(
                status_code=400,
                detail="Invalid priority filter"
            )

        query = query.filter(
            Complaint.priority == priority
        )

    if status is not None:
        if status not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid status filter"
            )

        query = query.filter(
            Complaint.status == status
        )

    return (
        query
        .order_by(Complaint.reported_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# 3. Retrieve one complaint
@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db)
):

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint


# 4. Update complaint status and resolution details
@router.patch("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(
    complaint_id: int,
    data: ComplaintUpdate,
    db: Session = Depends(get_db)
):

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    updates = data.model_dump(exclude_unset=True)

    if "status" in updates and updates["status"] is not None:
        if updates["status"] not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid complaint status"
            )

        if (
            updates["status"] == "Resolved"
            and complaint.status != "Resolved"
        ):
            complaint.resolved_at = datetime.now(timezone.utc)

        elif updates["status"] != "Resolved":
            complaint.resolved_at = None

    if "priority" in updates and updates["priority"] is not None:
        if updates["priority"] not in ALLOWED_PRIORITIES:
            raise HTTPException(
                status_code=400,
                detail="Invalid complaint priority"
            )

    for field, value in updates.items():
        setattr(complaint, field, value)

    db.commit()
    db.refresh(complaint)

    return complaint