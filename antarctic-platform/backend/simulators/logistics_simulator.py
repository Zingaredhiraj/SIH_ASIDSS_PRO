def get_transport_window(station_id: str, weather: dict) -> dict:
    wind = weather.get("wind_speed", 0)
    vis = weather.get("visibility", 10)
    temp = weather.get("temperature", 0)
    
    air_available = True
    sea_available = True
    reason = "Conditions nominal."
    risk_level = "LOW"
    
    if wind > 40 or vis < 1.0:
        air_available = False
        reason = "High winds or low visibility preventing air operations."
        risk_level = "MEDIUM"
        
    if wind > 60 or temp < -30:
        sea_available = False
        reason = "Severe conditions preventing both air and sea operations."
        risk_level = "HIGH"
        
    return {
        "air_available": air_available,
        "sea_available": sea_available,
        "reason": reason,
        "risk_level": risk_level
    }
