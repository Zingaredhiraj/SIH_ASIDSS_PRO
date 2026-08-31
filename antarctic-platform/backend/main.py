from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import os
from core.config import settings
from db.mongo import create_indexes
from simulators.telemetry_simulator import run_telemetry_simulator
from routers import stations, personnel, security, logistics, environment, polar_ai, emergency, digital_twin, admin
from ws import telemetry_ws, incident_ws

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_indexes()
    asyncio.create_task(run_telemetry_simulator())
    yield

app = FastAPI(
    title="Antarctic Station Digital Platform",
    version="1.0.0",
    lifespan=lifespan,
    # In production Render deployment, disable the interactive docs if desired:
    # docs_url=None, redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stations.router, prefix="/api")
app.include_router(personnel.router, prefix="/api")
app.include_router(security.router, prefix="/api")
app.include_router(logistics.router, prefix="/api")
app.include_router(environment.router, prefix="/api")
app.include_router(polar_ai.router, prefix="/api")
app.include_router(emergency.router, prefix="/api")
app.include_router(digital_twin.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

# WebSocket routers — prefix must match what frontend connects to
app.include_router(telemetry_ws.router, prefix="/ws/telemetry", tags=["WebSockets"])
app.include_router(incident_ws.router, prefix="/ws/incidents", tags=["WebSockets"])

@app.get("/")
async def root():
    """Root endpoint — confirms the API is running."""
    return {
        "name": "Antarctic Station Digital Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    from db.mongo import get_client
    import datetime
    client = get_client()
    try:
        await client.admin.command("ping")
        mongo_status = "ok"
    except Exception as e:
        mongo_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "mongo_status": mongo_status,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "isSimulation": True,
        "dataDisclaimer": "This platform uses simulated data for demonstration purposes only."
    }

# Entry point for direct execution and Render deployment
# Render injects PORT environment variable automatically
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
