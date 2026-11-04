
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.incident import Incident
from app.models.elevator import Elevator
from app.models.complaint import Complaint
from app.models.prediction import Prediction

from app.schemas.incident import (
    IncidentCreate,
    IncidentUpdate,
    IncidentResponse
)

from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/incidents",
    tags=["Incidents & Investigation"]
)


READ_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
)

INCIDENT_MANAGEMENT_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager"
)

ALLOWED_SEVERITIES = ["Low", "Medium", "High", "Critical"]

ALLOWED_STATUSES = [
    "Open",
    "Under Investigation",
    "Resolved",
    "Closed"
]


# 1. Create an incident
# Administrator, Technical Engineer and Regional Manager
@router.post(
    "",
    response_model=IncidentResponse,
    status_code=201,
    dependencies=[
        Depends(require_roles(*INCIDENT_MANAGEMENT_ROLES))
    ]
)
def create_incident(
    data: IncidentCreate,
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

    if data.complaint_id is not None:
        complaint = db.query(Complaint).filter(
            Complaint.id == data.complaint_id
        ).first()

        if not complaint:
            raise HTTPException(
                status_code=404,
                detail="Associated complaint not found"
            )

        if complaint.elevator_id != data.elevator_id:
            raise HTTPException(
                status_code=400,
                detail="Complaint does not belong to the specified elevator"
            )

    if data.prediction_id is not None:
        prediction = db.query(Prediction).filter(
            Prediction.id == data.prediction_id
        ).first()

        if not prediction:
            raise HTTPException(
                status_code=404,
                detail="Associated prediction not found"
            )

        if prediction.elevator_id != data.elevator_id:
            raise HTTPException(
                status_code=400,
                detail="Prediction does not belong to the specified elevator"
            )

    if data.severity not in ALLOWED_SEVERITIES:
        raise HTTPException(
            status_code=400,
            detail="Invalid incident severity"
        )

    incident = Incident(**data.model_dump())

    db.add(incident)
    db.commit()
    db.refresh(incident)

    return incident


# 2. Retrieve incidents with optional filters
# All authenticated roles
@router.get(
    "",
    response_model=list[IncidentResponse],
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_incidents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    elevator_id: int | None = Query(None, gt=0),
    severity: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Incident)

    if elevator_id is not None:
        query = query.filter(
            Incident.elevator_id == elevator_id
        )

    if severity is not None:
        if severity not in ALLOWED_SEVERITIES:
            raise HTTPException(
                status_code=400,
                detail="Invalid severity filter"
            )

        query = query.filter(
            Incident.severity == severity
        )

    if status is not None:
        if status not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid incident status filter"
            )

        query = query.filter(
            Incident.status == status
        )

    return (
        query
        .order_by(Incident.detected_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# 3. Retrieve one incident
# All authenticated roles
@router.get(
    "/{incident_id}",
    response_model=IncidentResponse,
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db)
):

    incident = db.query(Incident).filter(
        Incident.id == incident_id
    ).first()

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident


# 4. Update investigation and resolution details
# Administrator, Technical Engineer and Regional Manager
@router.patch(
    "/{incident_id}",
    response_model=IncidentResponse,
    dependencies=[
        Depends(require_roles(*INCIDENT_MANAGEMENT_ROLES))
    ]
)
def update_incident(
    incident_id: int,
    data: IncidentUpdate,
    db: Session = Depends(get_db)
):

    incident = db.query(Incident).filter(
        Incident.id == incident_id
    ).first()

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    updates = data.model_dump(exclude_unset=True)

    if updates.get("severity") is not None:
        if updates["severity"] not in ALLOWED_SEVERITIES:
            raise HTTPException(
                status_code=400,
                detail="Invalid incident severity"
            )

    if updates.get("status") is not None:
        if updates["status"] not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid incident status"
            )

        if (
            updates["status"] == "Resolved"
            and incident.status != "Resolved"
        ):
            incident.resolved_at = datetime.now(timezone.utc)

        elif updates["status"] != "Resolved":
            incident.resolved_at = None

    for field, value in updates.items():
        setattr(incident, field, value)

    db.commit()
    db.refresh(incident)

    return incident
