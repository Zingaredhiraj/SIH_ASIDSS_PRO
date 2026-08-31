def calculate_security_risk(access_points: list[dict], recent_events: list[dict]) -> dict:
    risk_score = 0
    alerts = []
    
    for point in access_points:
        if point.get("status") == "ALERT":
            risk_score += 30
            alerts.append({"point": point.get("name"), "reason": "Access point in ALERT status", "severity": "HIGH"})
        elif point.get("status") == "OPEN":
            risk_score += 10
            alerts.append({"point": point.get("name"), "reason": "Access point OPEN", "severity": "MEDIUM"})
            
    unauthorized_events = [e for e in recent_events if not e.get("authorized")]
    if unauthorized_events:
        risk_score += len(unauthorized_events) * 20
        alerts.append({"point": "Multiple", "reason": f"{len(unauthorized_events)} unauthorized access events detected", "severity": "HIGH"})
        
    overall_risk = "LOW"
    if risk_score > 60:
        overall_risk = "HIGH"
    elif risk_score > 30:
        overall_risk = "MEDIUM"
        
    return {
        "overall_risk": overall_risk,
        "risk_score": min(risk_score, 100),
        "alerts": alerts
    }

def correlate_field_personnel(access_events: list, personnel_in_field: list) -> list[dict]:
    correlated = []
    for p in personnel_in_field:
        p_events = [e for e in access_events if e.get("personnel_id") == str(p.get("_id"))]
        last_event = max(p_events, key=lambda x: x.get("timestamp")) if p_events else None
        
        correlated.append({
            "personnel_id": str(p.get("_id")),
            "name": p.get("name"),
            "department": p.get("department"),
            "last_known_point": last_event.get("point_name") if last_event else "Unknown",
            "last_known_time": last_event.get("timestamp") if last_event else None
        })
    return correlated
