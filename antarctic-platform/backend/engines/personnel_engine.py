def calculate_operational_readiness(personnel: list[dict]) -> dict:
    total = len(personnel)
    if total == 0:
        return {"readiness_pct": 0, "on_duty_count": 0, "off_duty_count": 0, "in_field_count": 0, "by_department": {}, "risk_level": "UNKNOWN"}
    
    on_duty = sum(1 for p in personnel if p.get("status") == "ON_DUTY")
    off_duty = sum(1 for p in personnel if p.get("status") == "OFF_DUTY")
    in_field = sum(1 for p in personnel if p.get("status") == "IN_FIELD_OPS")
    
    readiness_pct = (on_duty + in_field) / total * 100
    
    depts = {}
    for p in personnel:
        dept = p.get("department", "Unknown")
        depts[dept] = depts.get(dept, 0) + 1
        
    risk_level = "LOW"
    if readiness_pct < 50:
        risk_level = "HIGH"
    elif readiness_pct < 75:
        risk_level = "MEDIUM"
        
    return {
        "readiness_pct": round(readiness_pct, 2),
        "on_duty_count": on_duty,
        "off_duty_count": off_duty,
        "in_field_count": in_field,
        "by_department": depts,
        "risk_level": risk_level
    }

def get_shift_coverage(shift_schedule: list[dict], personnel: list[dict]) -> list[dict]:
    coverage = []
    for shift in shift_schedule:
        shift_name = shift.get("name")
        assigned = [p for p in personnel if p.get("shift") == shift_name]
        coverage.append({
            "shift_name": shift_name,
            "hours": f"{shift.get('start_time')}-{shift.get('end_time')}",
            "assigned_count": len(assigned),
            "personnel": assigned
        })
    return coverage
