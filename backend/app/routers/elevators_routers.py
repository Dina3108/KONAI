from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.building import Building
from app.models.elevator import Elevator
from app.schemas.elevator import (
    ElevatorCreate,
    ElevatorUpdate,
    ElevatorResponse
)

router = APIRouter(
    prefix="/api/v1/elevators",
    tags=["Elevators"]
)


@router.post(
    "",
    response_model=ElevatorResponse,
    status_code=status.HTTP_201_CREATED
)
def create_elevator(
    elevator_data: ElevatorCreate,
    db: Session = Depends(get_db)
):
    building = db.query(Building).filter(
        Building.id == elevator_data.building_id
    ).first()

    if not building:
        raise HTTPException(
            status_code=404,
            detail="Associated building not found"
        )

    existing = db.query(Elevator).filter(
        Elevator.elevator_code == elevator_data.elevator_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Elevator code already exists"
        )

    elevator = Elevator(**elevator_data.model_dump())

    db.add(elevator)

    try:
        db.commit()
        db.refresh(elevator)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not create elevator because of a database conflict"
        )

    return elevator


@router.get("", response_model=list[ElevatorResponse])
def get_elevators(
    skip: int = 0,
    limit: int = 100,
    building_id: int | None = None,
    db: Session = Depends(get_db)
):
    if skip < 0 or limit < 1 or limit > 500:
        raise HTTPException(
            status_code=400,
            detail="Use skip >= 0 and limit between 1 and 500"
        )

    query = db.query(Elevator)

    if building_id is not None:
        query = query.filter(
            Elevator.building_id == building_id
        )

    return (
        query.order_by(Elevator.id)
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{elevator_id}", response_model=ElevatorResponse)
def get_elevator(
    elevator_id: int,
    db: Session = Depends(get_db)
):
    elevator = db.query(Elevator).filter(
        Elevator.id == elevator_id
    ).first()

    if not elevator:
        raise HTTPException(
            status_code=404,
            detail="Elevator not found"
        )

    return elevator


@router.put("/{elevator_id}", response_model=ElevatorResponse)
def update_elevator(
    elevator_id: int,
    elevator_data: ElevatorUpdate,
    db: Session = Depends(get_db)
):
    elevator = db.query(Elevator).filter(
        Elevator.id == elevator_id
    ).first()

    if not elevator:
        raise HTTPException(
            status_code=404,
            detail="Elevator not found"
        )

    updates = elevator_data.model_dump(
        exclude_unset=True,
        exclude_none=True
    )

    if "building_id" in updates:
        building = db.query(Building).filter(
            Building.id == updates["building_id"]
        ).first()

        if not building:
            raise HTTPException(
                status_code=404,
                detail="Associated building not found"
            )

    for field, value in updates.items():
        setattr(elevator, field, value)

    try:
        db.commit()
        db.refresh(elevator)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not update elevator because of a database conflict"
        )

    return elevator


@router.delete("/{elevator_id}")
def delete_elevator(
    elevator_id: int,
    db: Session = Depends(get_db)
):
    elevator = db.query(Elevator).filter(
        Elevator.id == elevator_id
    ).first()

    if not elevator:
        raise HTTPException(
            status_code=404,
            detail="Elevator not found"
        )

    db.delete(elevator)
    db.commit()

    return {
        "message": "Elevator deleted successfully",
        "elevator_id": elevator_id
    }