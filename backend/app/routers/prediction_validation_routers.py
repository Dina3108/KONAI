
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.prediction import Prediction
from app.models.prediction_validation import PredictionValidation
from app.schemas.prediction_validation import (
    PredictionValidationCreate,
    PredictionValidationResponse
)
from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/prediction-validations",
    tags=["Prediction Validation"]
)


READ_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
)

ALLOWED_RESULTS = [
    "Confirmed",
    "False Positive",
    "Inconclusive"
]


# 1. Create a validation record
# Administrator and Technical Engineer only
@router.post(
    "",
    response_model=PredictionValidationResponse,
    status_code=201,
    dependencies=[
        Depends(require_roles("Administrator", "Technical Engineer"))
    ]
)
def create_validation(
    data: PredictionValidationCreate,
    db: Session = Depends(get_db)
):

    prediction = db.query(Prediction).filter(
        Prediction.id == data.prediction_id
    ).first()

    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Associated prediction not found"
        )

    if data.validation_result not in ALLOWED_RESULTS:
        raise HTTPException(
            status_code=400,
            detail=f"Validation result must be one of: {', '.join(ALLOWED_RESULTS)}"
        )

    validation = PredictionValidation(**data.model_dump())

    db.add(validation)

    # Keep the prediction's investigation status in sync.
    if data.validation_result == "Confirmed":
        prediction.prediction_status = "Validated"

    elif data.validation_result == "False Positive":
        prediction.prediction_status = "False Positive"

    else:
        prediction.prediction_status = "Under Investigation"

    db.commit()
    db.refresh(validation)

    return validation


# 2. Retrieve all validation records
# All authenticated roles
@router.get(
    "",
    response_model=list[PredictionValidationResponse],
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_validations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    prediction_id: int | None = Query(None, gt=0),
    validation_result: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(PredictionValidation)

    if prediction_id is not None:
        query = query.filter(
            PredictionValidation.prediction_id == prediction_id
        )

    if validation_result:
        if validation_result not in ALLOWED_RESULTS:
            raise HTTPException(
                status_code=400,
                detail="Invalid validation result filter"
            )

        query = query.filter(
            PredictionValidation.validation_result == validation_result
        )

    return (
        query
        .order_by(PredictionValidation.validated_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# 3. Retrieve one validation record
# All authenticated roles
@router.get(
    "/{validation_id}",
    response_model=PredictionValidationResponse,
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_validation(
    validation_id: int,
    db: Session = Depends(get_db)
):

    validation = db.query(PredictionValidation).filter(
        PredictionValidation.id == validation_id
    ).first()

    if not validation:
        raise HTTPException(
            status_code=404,
            detail="Validation record not found"
        )

    return validation


# 4. Retrieve validation history for one prediction
# All authenticated roles
@router.get(
    "/prediction/{prediction_id}",
    response_model=list[PredictionValidationResponse],
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_prediction_validation_history(
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

    return (
        db.query(PredictionValidation)
        .filter(
            PredictionValidation.prediction_id == prediction_id
        )
        .order_by(PredictionValidation.validated_at.desc())
        .all()
    )
