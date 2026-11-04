
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect

from app.database import engine, Base
from app import models

# Import routers using their actual filenames
from app.routers.building_routers import router as building_router
from app.routers.elevators_routers import router as elevator_router
from app.routers.sensor_routers import router as sensor_router
from app.routers.telemetry_routers import router as telemetry_router
from app.routers.device_routers import router as device_router
from app.routers.prediction_routers import router as prediction_router
from app.routers.prediction_validation_routers import (
    router as prediction_validation_router
)
from app.routers.complaint_routers import router as complaint_router
from app.routers.incident_routers import router as incident_router
from app.routers.maintenance_routers import router as maintenance_router
from app.routers.cross_elevator_routers import router as cross_elevator_router
from app.routers.model_operations_routers import router as model_operations_router
from app.routers.reports_routers import router as reports_router
from app.routers.auth_routers import router as auth_router

app = FastAPI(
    title="KONE Technical Intelligence Platform API",
    description="Shared REST API backend for KONE web and mobile applications.",
    version="1.0.0"
)


# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Create database tables during application startup
@app.on_event("startup")
def create_database_tables():
    Base.metadata.create_all(bind=engine)


# Register REST API routers
app.include_router(building_router)
app.include_router(elevator_router)
app.include_router(sensor_router)
app.include_router(telemetry_router)
app.include_router(device_router)
app.include_router(prediction_router)
app.include_router(prediction_validation_router)
app.include_router(complaint_router)
app.include_router(incident_router)
app.include_router(maintenance_router)
app.include_router(cross_elevator_router)
app.include_router(model_operations_router)
app.include_router(reports_router)
app.include_router(auth_router)
# Home endpoint
@app.get("/")
def home():
    return {
        "message": "KONE Technical Intelligence Platform API is running",
        "version": "1.0.0",
        "status": "online"
    }


# Backend health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KONE Backend"
    }


# PostgreSQL connection check
@app.get("/health/db")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "connected",
            "database": "konai_db"
        }

    except Exception as error:
        return {
            "status": "disconnected",
            "database": "konai_db",
            "error": str(error)
        }


# Database table verification
@app.get("/health/tables")
def database_tables():
    inspector = inspect(engine)

    return {
        "database": "konai_db",
        "tables": inspector.get_table_names()
    }
