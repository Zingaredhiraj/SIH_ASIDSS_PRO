from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

def get_client() -> AsyncIOMotorClient:
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.MONGO_URL)
    return db.client

def get_db():
    client = get_client()
    return client[settings.MONGO_DB]

def get_stations_col(): return get_db()["stations"]
def get_telemetry_col(): return get_db()["telemetry_raw"]
def get_personnel_col(): return get_db()["personnel"]
def get_shift_schedule_col(): return get_db()["shift_schedule"]
def get_access_points_col(): return get_db()["access_points"]
def get_access_events_col(): return get_db()["access_events"]
def get_resupply_col(): return get_db()["resupply_schedule"]
def get_inventory_col(): return get_db()["consumables_inventory"]
def get_weather_col(): return get_db()["weather_readings"]
def get_hazard_thresholds_col(): return get_db()["hazard_thresholds"]
def get_incidents_col(): return get_db()["incidents"]
def get_muster_col(): return get_db()["muster_roll"]
def get_evacuation_routes_col(): return get_db()["evacuation_routes"]
def get_sop_documents_col(): return get_db()["sop_documents"]
def get_ai_chat_logs_col(): return get_db()["ai_chat_logs"]
def get_assets_3d_col(): return get_db()["assets_3d"]
def get_asset_status_col(): return get_db()["asset_status"]
def get_users_col(): return get_db()["users"]
def get_roles_col(): return get_db()["roles"]
def get_audit_logs_col(): return get_db()["audit_logs"]

async def create_indexes():
    await get_users_col().create_index("email", unique=True)
    await get_telemetry_col().create_index([("station_id", 1), ("timestamp", -1)])
    await get_weather_col().create_index([("station_id", 1), ("timestamp", -1)])
    await get_access_events_col().create_index([("station_id", 1), ("timestamp", -1)])
