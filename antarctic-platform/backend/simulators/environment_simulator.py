import asyncio
import random
from datetime import datetime

weather_subscribers = {}

async def broadcast_weather(station_id: str, data: dict):
    if station_id in weather_subscribers:
        for queue in weather_subscribers[station_id]:
            await queue.put(data)

_latest_weather = {}

def get_latest_weather(station_id: str) -> dict:
    return _latest_weather.get(station_id, {})

def generate_weather_reading(station_id: str) -> dict:
    temp = random.uniform(-40, -15)
    wind = random.uniform(10, 80)
    vis = random.uniform(0.1, 10)
    reading = {
        "station_id": station_id,
        "timestamp": datetime.utcnow(),
        "temperature": round(temp, 1),
        "wind_speed": round(wind, 1),
        "wind_direction": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
        "visibility": round(vis, 2),
        "snowfall": round(random.uniform(0, 5), 1),
        "pressure": round(random.uniform(950, 1013), 1)
    }
    _latest_weather[station_id] = reading
    return reading

def check_hazard_thresholds(station_id: str, reading: dict) -> list[dict]:
    from engines.environment_engine import check_hazard_conditions
    # Hardcoded mock thresholds for simulator
    thresholds = [
        {"metric": "wind_speed", "operator": ">", "value": 60, "hazard_type": "STORM_WARNING", "severity": "HIGH"},
        {"metric": "temperature", "operator": "<", "value": -35, "hazard_type": "EXTREME_COLD", "severity": "HIGH"},
        {"metric": "visibility", "operator": "<", "value": 0.5, "hazard_type": "WHITEOUT", "severity": "HIGH"}
    ]
    return check_hazard_conditions(reading, thresholds)
