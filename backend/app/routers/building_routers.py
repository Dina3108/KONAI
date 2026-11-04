from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.building import Building
from app.models.elevator import Elevator
from app.schemas.building import (
    BuildingCreate,
    BuildingUpdate,
    BuildingResponse
)
from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/buildings",
    tags=["Buildings"]
)


# -------------------------------------------------
# 1. CREATE BUILDING - ADMINISTRATOR ONLY
# -------------------------------------------------

@router.post(
    "",
    response_model=BuildingResponse,
    status_code=201
)
def create_building(
    data: BuildingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Administrator"))
):
    existing = db.query(Building).filter(
        Building.building_code == data.building_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Building code already exists"
        )

    building = Building(**data.model_dump())

    db.add(building)
    db.commit()
    db.refresh(building)

    return building


# -------------------------------------------------
# 2. GET ALL BUILDINGS - ALL AUTHENTICATED ROLES
# -------------------------------------------------

@router.get("", response_model=list[BuildingResponse])
def get_buildings(
    skip: int = 0,
    limit: int = 100,
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
            detail="Invalid pagination values"
        )

    return (
        db.query(Building)
        .order_by(Building.id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# -------------------------------------------------
# 3. GET BUILDING BY ID - ALL AUTHENTICATED ROLES
# -------------------------------------------------

@router.get("/{building_id}", response_model=BuildingResponse)
def get_building(
    building_id: int,
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
    building = db.query(Building).filter(
        Building.id == building_id
    ).first()

    if not building:
        raise HTTPException(
            status_code=404,
            detail="Building not found"
        )

    return building


# -------------------------------------------------
# 4. UPDATE BUILDING - ADMINISTRATOR / ENGINEER
# -------------------------------------------------

@router.put("/{building_id}", response_model=BuildingResponse)
def update_building(
    building_id: int,
    data: BuildingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(
            "Administrator",
            "Technical Engineer"
        )
    )
):
    building = db.query(Building).filter(
        Building.id == building_id
    ).first()

    if not building:
        raise HTTPException(
            status_code=404,
            detail="Building not found"
        )

    updates = data.model_dump(
        exclude_unset=True,
        exclude_none=True
    )

    for field, value in updates.items():
        setattr(building, field, value)

    db.commit()
    db.refresh(building)

    return building


# -------------------------------------------------
# 5. DELETE BUILDING - ADMINISTRATOR ONLY
# -------------------------------------------------

@router.delete("/{building_id}")
def delete_building(
    building_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("Administrator"))
):
    building = db.query(Building).filter(
        Building.id == building_id
    ).first()

    if not building:
        raise HTTPException(
            status_code=404,
            detail="Building not found"
        )

    elevator_exists = db.query(Elevator).filter(
        Elevator.building_id == building_id
    ).first()

    if elevator_exists:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete a building that contains elevators"
        )

    db.delete(building)
    db.commit()

    return {
        "message": "Building deleted successfully"
    }