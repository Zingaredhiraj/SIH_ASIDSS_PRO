def calculate_weather_trend(readings: list[dict]) -> dict:
    if len(readings) < 2:
        return {"temperature_trend": "STABLE", "wind_trend": "STABLE", "visibility_trend": "STABLE", "forecast_summary": "Insufficient data for forecast"}
        
    latest = readings[0]
    older = readings[-1]
    
    temp_diff = latest.get("temperature", 0) - older.get("temperature", 0)
    wind_diff = latest.get("wind_speed", 0) - older.get("wind_speed", 0)
    vis_diff = latest.get("visibility", 0) - older.get("visibility", 0)
    
    temp_trend = "RISING" if temp_diff > 2 else "FALLING" if temp_diff < -2 else "STABLE"
    wind_trend = "RISING" if wind_diff > 5 else "FALLING" if wind_diff < -5 else "STABLE"
    vis_trend = "RISING" if vis_diff > 1 else "FALLING" if vis_diff < -1 else "STABLE"
    
    summary = f"Temperature is {temp_trend.lower()}, wind is {wind_trend.lower()}."
    if wind_trend == "RISING" and vis_trend == "FALLING":
        summary += " Warning: Deteriorating conditions."
        
    return {
        "temperature_trend": temp_trend,
        "wind_trend": wind_trend,
        "visibility_trend": vis_trend,
        "forecast_summary": summary
    }

def check_hazard_conditions(reading: dict, thresholds: list[dict]) -> list[dict]:
    hazards = []
    for t in thresholds:
        metric = t.get("metric")
        op = t.get("operator")
        val = t.get("value")
        
        current_val = reading.get(metric)
        if current_val is None: continue
        
        triggered = False
        if op == ">" and current_val > val: triggered = True
        elif op == "<" and current_val < val: triggered = True
        elif op == ">=" and current_val >= val: triggered = True
        elif op == "<=" and current_val <= val: triggered = True
        elif op == "==" and current_val == val: triggered = True
        
        if triggered:
            hazards.append({
                "hazard": t.get("hazard_type"),
                "metric": metric,
                "current_value": current_val,
                "threshold": val,
                "severity": t.get("severity", "MEDIUM")
            })
            
    return hazards

def generate_pre_incident_advisory(triggered_hazards: list) -> dict | None:
    high_hazards = [h for h in triggered_hazards if h.get("severity") == "HIGH"]
    if not high_hazards:
        return None
        
    return {
        "advisory_type": "PRE_INCIDENT_WARNING",
        "message": f"Critical environmental hazards detected: {', '.join([h['hazard'] for h in high_hazards])}. Prepare for potential operational impact.",
        "recommended_actions": ["Review SOPs", "Alert field teams", "Secure loose external assets"]
    }
