
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.building import Building
from app.models.elevator import Elevator
from app.models.sensor import Sensor
from app.models.telemetry import Telemetry
from app.models.device import Device
from app.models.incident import Incident
from app.models.maintenance import Maintenance

from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/cross-elevator",
    tags=["Cross-Elevator Intelligence"]
)


READ_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
)


# 1. Fleet-wide intelligence summary
# All authenticated roles
@router.get(
    "/fleet-summary",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def get_fleet_summary(db: Session = Depends(get_db)):

    total_buildings = db.query(func.count(Building.id)).scalar() or 0
    total_elevators = db.query(func.count(Elevator.id)).scalar() or 0
    total_sensors = db.query(func.count(Sensor.id)).scalar() or 0
    total_devices = db.query(func.count(Device.id)).scalar() or 0

    total_readings = db.query(func.count(Telemetry.id)).scalar() or 0
    total_incidents = db.query(func.count(Incident.id)).scalar() or 0
    total_work_orders = db.query(func.count(Maintenance.id)).scalar() or 0

    online_devices = db.query(func.count(Device.id)).filter(
        Device.connectivity_status == "Online",
        Device.is_active.is_(True)
    ).scalar() or 0

    open_incidents = db.query(func.count(Incident.id)).filter(
        Incident.status.in_(["Open", "Under Investigation"])
    ).scalar() or 0

    active_work_orders = db.query(func.count(Maintenance.id)).filter(
        Maintenance.status.in_(["Scheduled", "In Progress", "On Hold"])
    ).scalar() or 0

    return {
        "total_buildings": total_buildings,
        "total_elevators": total_elevators,
        "total_sensors": total_sensors,
        "total_devices": total_devices,
        "total_telemetry_readings": total_readings,
        "total_incidents": total_incidents,
        "open_incidents": open_incidents,
        "total_maintenance_work_orders": total_work_orders,
        "active_work_orders": active_work_orders,
        "online_active_devices": online_devices
    }


# 2. Compare elevators across the fleet
# All authenticated roles
@router.get(
    "/elevator-comparison",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def compare_elevators(
    building_id: int | None = Query(None, gt=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):

    query = db.query(Elevator)

    if building_id is not None:
        building = db.query(Building).filter(
            Building.id == building_id
        ).first()

        if not building:
            raise HTTPException(
                status_code=404,
                detail="Building not found"
            )

        query = query.filter(Elevator.building_id == building_id)

    elevators = query.order_by(Elevator.id).limit(limit).all()

    results = []

    for elevator in elevators:

        reading_stats = (
            db.query(
                func.count(Telemetry.id),
                func.avg(Telemetry.value)
            )
            .join(Sensor, Telemetry.sensor_id == Sensor.id)
            .filter(Sensor.elevator_id == elevator.id)
            .first()
        )

        incident_count = db.query(
            func.count(Incident.id)
        ).filter(
            Incident.elevator_id == elevator.id
        ).scalar() or 0

        active_incidents = db.query(
            func.count(Incident.id)
        ).filter(
            Incident.elevator_id == elevator.id,
            Incident.status.in_(["Open", "Under Investigation"])
        ).scalar() or 0

        maintenance_count = db.query(
            func.count(Maintenance.id)
        ).filter(
            Maintenance.elevator_id == elevator.id
        ).scalar() or 0

        results.append({
            "elevator_id": elevator.id,
            "elevator_code": elevator.elevator_code,
            "building_id": elevator.building_id,
            "model": elevator.model,
            "operational_status": elevator.operational_status,
            "health_status": elevator.health_status,
            "telemetry_reading_count": reading_stats[0] or 0,
            "average_telemetry_value": (
                round(float(reading_stats[1]), 2)
                if reading_stats[1] is not None else None
            ),
            "incident_count": incident_count,
            "active_incident_count": active_incidents,
            "maintenance_work_order_count": maintenance_count
        })

    return {
        "total_elevators_compared": len(results),
        "results": results,
        "note": "Average telemetry combines readings from all sensor types and units. Do not compare this value across different measurement units."
    }


# 3. Compare buildings
# All authenticated roles
@router.get(
    "/building-comparison",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def compare_buildings(db: Session = Depends(get_db)):

    buildings = db.query(Building).order_by(Building.id).all()

    results = []

    for building in buildings:

        elevator_count = db.query(
            func.count(Elevator.id)
        ).filter(
            Elevator.building_id == building.id
        ).scalar() or 0

        incident_count = (
            db.query(func.count(Incident.id))
            .join(Elevator, Incident.elevator_id == Elevator.id)
            .filter(Elevator.building_id == building.id)
            .scalar() or 0
        )

        maintenance_count = (
            db.query(func.count(Maintenance.id))
            .join(Elevator, Maintenance.elevator_id == Elevator.id)
            .filter(Elevator.building_id == building.id)
            .scalar() or 0
        )

        results.append({
            "building_id": building.id,
            "building_code": building.building_code,
            "building_name": building.name,
            "city": building.city,
            "elevator_count": elevator_count,
            "incident_count": incident_count,
            "maintenance_work_order_count": maintenance_count
        })

    return {
        "total_buildings_compared": len(results),
        "results": results
    }


# 4. Compare elevator models
# All authenticated roles
@router.get(
    "/model-comparison",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def compare_elevator_models(db: Session = Depends(get_db)):

    models = (
        db.query(
            Elevator.model,
            func.count(Elevator.id).label("elevator_count")
        )
        .group_by(Elevator.model)
        .order_by(Elevator.model)
        .all()
    )

    results = []

    for model_name, elevator_count in models:

        elevator_ids = db.query(Elevator.id).filter(
            Elevator.model == model_name
        ).subquery()

        incident_count = db.query(
            func.count(Incident.id)
        ).filter(
            Incident.elevator_id.in_(elevator_ids)
        ).scalar() or 0

        maintenance_count = db.query(
            func.count(Maintenance.id)
        ).filter(
            Maintenance.elevator_id.in_(elevator_ids)
        ).scalar() or 0

        results.append({
            "model": model_name,
            "elevator_count": elevator_count,
            "incident_count": incident_count,
            "maintenance_work_order_count": maintenance_count
        })

    return {
        "total_models_compared": len(results),
        "results": results
    }


# 5. Compare device connectivity by elevator
# All authenticated roles
@router.get(
    "/device-connectivity",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def compare_device_connectivity(db: Session = Depends(get_db)):

    elevators = db.query(Elevator).order_by(Elevator.id).all()

    results = []

    for elevator in elevators:

        devices = db.query(Device).filter(
            Device.elevator_id == elevator.id,
            Device.is_active.is_(True)
        ).all()

        online = sum(
            1 for device in devices
            if device.connectivity_status == "Online"
        )

        offline = sum(
            1 for device in devices
            if device.connectivity_status == "Offline"
        )

        results.append({
            "elevator_id": elevator.id,
            "elevator_code": elevator.elevator_code,
            "active_device_count": len(devices),
            "online_device_count": online,
            "offline_device_count": offline,
            "other_status_count": len(devices) - online - offline
        })

    return {
        "total_elevators_compared": len(results),
        "results": results
    }
