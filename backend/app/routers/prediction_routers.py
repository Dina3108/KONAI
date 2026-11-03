from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.prediction import Prediction
from app.models.elevator import Elevator
from app.schemas.prediction import (
    PredictionCreate,
    PredictionStatusUpdate,
    PredictionResponse
)


router = APIRouter(
    prefix="/api/v1/predictions",
    tags=["AI Prediction & Diagnosis"]
)


# 1. Store a prediction
@router.post(
    "",
    response_model=PredictionResponse,
    status_code=201
)
def create_prediction(
    data: PredictionCreate,
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

    prediction = Prediction(**data.model_dump())

    db.add(prediction)

    try:
        db.commit()
        db.refresh(prediction)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not save prediction"
        )

    return prediction


# 2. Retrieve predictions with optional filters
@router.get("", response_model=list[PredictionResponse])
def get_predictions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    elevator_id: int | None = Query(None, gt=0),
    severity: str | None = None,
    prediction_status: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Prediction)

    if elevator_id is not None:
        query = query.filter(
            Prediction.elevator_id == elevator_id
        )

    if severity:
        query = query.filter(
            Prediction.severity == severity
        )

    if prediction_status:
        query = query.filter(
            Prediction.prediction_status == prediction_status
        )

    return (
        query
        .order_by(Prediction.generated_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# 3. Retrieve a specific prediction
@router.get("/{prediction_id}", response_model=PredictionResponse)
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db)
):

    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id
    ).first()

    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return prediction


# 4. Update prediction investigation status
@router.patch(
    "/{prediction_id}/status",
    response_model=PredictionResponse
)
def update_prediction_status(
    prediction_id: int,
    data: PredictionStatusUpdate,
    db: Session = Depends(get_db)
):

    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id
    ).first()

    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    allowed_statuses = [
        "Open",
        "Under Investigation",
        "Validated",
        "False Positive",
        "Resolved"
    ]

    if data.prediction_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of: {', '.join(allowed_statuses)}"
        )

    prediction.prediction_status = data.prediction_status

    db.commit()
    db.refresh(prediction)

    return prediction