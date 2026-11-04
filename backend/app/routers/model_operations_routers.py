
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.model_registry import ModelRegistry

from app.schemas.model_registry import (
    ModelRegistryCreate,
    ModelRegistryUpdate,
    ModelRegistryResponse
)

from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/model-operations",
    tags=["Model Operations"]
)


READ_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
)

MODEL_MANAGEMENT_ROLES = (
    "Administrator",
    "Technical Engineer"
)

ALLOWED_STATUSES = [
    "Registered",
    "Testing",
    "Staging",
    "Production",
    "Retired"
]


# 1. Register a model version
# Administrator and Technical Engineer
@router.post(
    "",
    response_model=ModelRegistryResponse,
    status_code=201,
    dependencies=[
        Depends(require_roles(*MODEL_MANAGEMENT_ROLES))
    ]
)
def register_model(
    data: ModelRegistryCreate,
    db: Session = Depends(get_db)
):

    if data.deployment_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Invalid deployment status"
        )

    existing = db.query(ModelRegistry).filter(
        ModelRegistry.model_name == data.model_name,
        ModelRegistry.model_version == data.model_version
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="This model name and version are already registered"
        )

    model = ModelRegistry(
        **data.model_dump(),
        is_active=False
    )

    db.add(model)

    try:
        db.commit()
        db.refresh(model)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not register model because of a database conflict"
        )

    return model


# 2. Retrieve registered models with filters
# All authenticated roles
@router.get(
    "",
    response_model=list[ModelRegistryResponse],
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_models(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    model_name: str | None = None,
    deployment_status: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(ModelRegistry)

    if model_name:
        query = query.filter(
            ModelRegistry.model_name == model_name
        )

    if deployment_status:
        if deployment_status not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=400,
                detail="Invalid deployment status filter"
            )

        query = query.filter(
            ModelRegistry.deployment_status == deployment_status
        )

    return (
        query
        .order_by(ModelRegistry.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# 3. Retrieve one registered model
# All authenticated roles
@router.get(
    "/{model_id}",
    response_model=ModelRegistryResponse,
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_model(
    model_id: int,
    db: Session = Depends(get_db)
):

    model = db.query(ModelRegistry).filter(
        ModelRegistry.id == model_id
    ).first()

    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )

    return model


# 4. Update model information, metrics and lifecycle
# Administrator and Technical Engineer
@router.patch(
    "/{model_id}",
    response_model=ModelRegistryResponse,
    dependencies=[
        Depends(require_roles(*MODEL_MANAGEMENT_ROLES))
    ]
)
def update_model(
    model_id: int,
    data: ModelRegistryUpdate,
    db: Session = Depends(get_db)
):

    model = db.query(ModelRegistry).filter(
        ModelRegistry.id == model_id
    ).first()

    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )

    updates = data.model_dump(exclude_unset=True)

    new_status = updates.get(
        "deployment_status",
        model.deployment_status
    )

    if new_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Invalid deployment status"
        )

    if new_status == "Production":

        # Only one version of a model name can be marked
        # as the active production version through this API.
        db.query(ModelRegistry).filter(
            ModelRegistry.model_name == model.model_name,
            ModelRegistry.id != model.id
        ).update(
            {
                ModelRegistry.is_active: False
            },
            synchronize_session=False
        )

        if model.deployment_status != "Production":
            model.deployed_at = datetime.now(timezone.utc)

        model.is_active = True

    else:
        model.is_active = False

    for field, value in updates.items():
        setattr(model, field, value)

    try:
        db.commit()
        db.refresh(model)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not update model"
        )

    return model
