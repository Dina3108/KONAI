
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.building import Building
from app.models.elevator import Elevator
from app.models.sensor import Sensor
from app.models.telemetry import Telemetry
from app.models.device import Device
from app.models.prediction import Prediction
from app.models.complaint import Complaint
from app.models.incident import Incident
from app.models.maintenance import Maintenance

from app.security import require_roles


router = APIRouter(
    prefix="/api/v1/reports",
    tags=["Reports & Analytics"]
)


READ_ROLES = (
    "Administrator",
    "Technical Engineer",
    "Regional Manager",
    "Viewer"
)


# 1. Fleet Performance Summary
# All authenticated roles
@router.get(
    "/fleet-summary",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def fleet_performance_summary(db: Session = Depends(get_db)):

    total_buildings = db.query(func.count(Building.id)).scalar() or 0
    total_elevators = db.query(func.count(Elevator.id)).scalar() or 0
    total_sensors = db.query(func.count(Sensor.id)).scalar() or 0
    total_devices = db.query(func.count(Device.id)).scalar() or 0

    total_predictions = db.query(
        func.count(Prediction.id)
    ).scalar() or 0

    total_complaints = db.query(
        func.count(Complaint.id)
    ).scalar() or 0

    total_incidents = db.query(
        func.count(Incident.id)
    ).scalar() or 0

    total_work_orders = db.query(
        func.count(Maintenance.id)
    ).scalar() or 0

    operational_elevators = db.query(
        func.count(Elevator.id)
    ).filter(
        Elevator.operational_status == "Operational"
    ).scalar() or 0

    open_incidents = db.query(
        func.count(Incident.id)
    ).filter(
        Incident.status.in_(["Open", "Under Investigation"])
    ).scalar() or 0

    completed_work_orders = db.query(
        func.count(Maintenance.id)
    ).filter(
        Maintenance.status == "Completed"
    ).scalar() or 0

    return {
        "report_name": "Fleet Performance Summary",
        "total_buildings": total_buildings,
        "total_elevators": total_elevators,
        "operational_elevators": operational_elevators,
        "other_status_elevators": total_elevators - operational_elevators,
        "total_sensors": total_sensors,
        "total_devices": total_devices,
        "total_predictions": total_predictions,
        "total_complaints": total_complaints,
        "total_incidents": total_incidents,
        "open_incidents": open_incidents,
        "total_work_orders": total_work_orders,
        "completed_work_orders": completed_work_orders
    }


# 2. Elevator Health Report
# All authenticated roles
@router.get(
    "/elevator-health",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def elevator_health_report(
    building_id: int | None = Query(None, gt=0),
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

        query = query.filter(
            Elevator.building_id == building_id
        )

    elevators = query.order_by(Elevator.id).all()

    results = []

    for elevator in elevators:

        sensor_count = db.query(
            func.count(Sensor.id)
        ).filter(
            Sensor.elevator_id == elevator.id
        ).scalar() or 0

        reading_count = (
            db.query(func.count(Telemetry.id))
            .join(Sensor, Telemetry.sensor_id == Sensor.id)
            .filter(Sensor.elevator_id == elevator.id)
            .scalar() or 0
        )

        incident_count = db.query(
            func.count(Incident.id)
        ).filter(
            Incident.elevator_id == elevator.id
        ).scalar() or 0

        prediction_count = db.query(
            func.count(Prediction.id)
        ).filter(
            Prediction.elevator_id == elevator.id
        ).scalar() or 0

        results.append({
            "elevator_id": elevator.id,
            "elevator_code": elevator.elevator_code,
            "building_id": elevator.building_id,
            "model": elevator.model,
            "operational_status": elevator.operational_status,
            "health_status": elevator.health_status,
            "sensor_count": sensor_count,
            "telemetry_reading_count": reading_count,
            "incident_count": incident_count,
            "prediction_count": prediction_count
        })

    return {
        "report_name": "Elevator Health Report",
        "total_elevators": len(results),
        "results": results
    }


# 3. Incident Analysis Report
# All authenticated roles
@router.get(
    "/incident-analysis",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def incident_analysis_report(db: Session = Depends(get_db)):

    total = db.query(
        func.count(Incident.id)
    ).scalar() or 0

    severity_results = (
        db.query(
            Incident.severity,
            func.count(Incident.id)
        )
        .group_by(Incident.severity)
        .all()
    )

    status_results = (
        db.query(
            Incident.status,
            func.count(Incident.id)
        )
        .group_by(Incident.status)
        .all()
    )

    type_results = (
        db.query(
            Incident.incident_type,
            func.count(Incident.id)
        )
        .group_by(Incident.incident_type)
        .all()
    )

    return {
        "report_name": "Incident Analysis Report",
        "total_incidents": total,
        "by_severity": [
            {"severity": severity, "count": count}
            for severity, count in severity_results
        ],
        "by_status": [
            {"status": status, "count": count}
            for status, count in status_results
        ],
        "by_incident_type": [
            {"incident_type": incident_type, "count": count}
            for incident_type, count in type_results
        ]
    }


# 4. Maintenance Performance Report
# All authenticated roles
@router.get(
    "/maintenance-performance",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def maintenance_performance_report(db: Session = Depends(get_db)):

    total = db.query(
        func.count(Maintenance.id)
    ).scalar() or 0

    completed = db.query(
        func.count(Maintenance.id)
    ).filter(
        Maintenance.status == "Completed"
    ).scalar() or 0

    in_progress = db.query(
        func.count(Maintenance.id)
    ).filter(
        Maintenance.status == "In Progress"
    ).scalar() or 0

    scheduled = db.query(
        func.count(Maintenance.id)
    ).filter(
        Maintenance.status == "Scheduled"
    ).scalar() or 0

    on_hold = db.query(
        func.count(Maintenance.id)
    ).filter(
        Maintenance.status == "On Hold"
    ).scalar() or 0

    cancelled = db.query(
        func.count(Maintenance.id)
    ).filter(
        Maintenance.status == "Cancelled"
    ).scalar() or 0

    completion_percentage = (
        round((completed / total) * 100, 2)
        if total > 0 else 0
    )

    priority_results = (
        db.query(
            Maintenance.priority,
            func.count(Maintenance.id)
        )
        .group_by(Maintenance.priority)
        .all()
    )

    return {
        "report_name": "Maintenance Performance Report",
        "total_work_orders": total,
        "completed": completed,
        "in_progress": in_progress,
        "scheduled": scheduled,
        "on_hold": on_hold,
        "cancelled": cancelled,
        "completion_percentage": completion_percentage,
        "by_priority": [
            {"priority": priority, "count": count}
            for priority, count in priority_results
        ]
    }


# 5. Device Connectivity Report
# All authenticated roles
@router.get(
    "/device-connectivity",
    dependencies=[Depends(require_roles(*READ_ROLES))]
)
def device_connectivity_report(db: Session = Depends(get_db)):

    active_devices = db.query(Device).filter(
        Device.is_active.is_(True)
    ).all()

    total = len(active_devices)

    online = sum(
        1 for device in active_devices
        if device.connectivity_status == "Online"
    )

    offline = sum(
        1 for device in active_devices
        if device.connectivity_status == "Offline"
    )

    unknown = total - online - offline

    results = []

    for device in active_devices:
        results.append({
            "device_id": device.id,
            "device_code": device.device_code,
            "device_name": device.device_name,
            "device_type": device.device_type,
            "elevator_id": device.elevator_id,
            "connectivity_status": device.connectivity_status,
            "firmware_version": device.firmware_version,
            "cpu_usage": device.cpu_usage,
            "temperature": device.temperature,
            "storage_usage": device.storage_usage,
            "last_communication": (
                device.last_communication.isoformat()
                if device.last_communication else None
            )
        })

    return {
        "report_name": "Device Connectivity Report",
        "total_active_devices": total,
        "online_devices": online,
        "offline_devices": offline,
        "other_status_devices": unknown,
        "results": results
    }
