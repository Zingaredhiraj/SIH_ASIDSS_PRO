class EscalationLevel:
    ADVISORY = 1
    ALERT = 2
    EMERGENCY = 3

def calculate_escalation_info(incident: dict) -> dict:
    level = incident.get("escalation_level", EscalationLevel.ADVISORY)
    
    info = {
        "level": level,
        "actions_required": [],
        "auto_notifications": []
    }
    
    if level == EscalationLevel.ADVISORY:
        info["label"] = "Advisory"
        info["color"] = "yellow"
        info["actions_required"] = ["Monitor situation", "Log initial assessment"]
        info["auto_notifications"] = ["Station Commander"]
    elif level == EscalationLevel.ALERT:
        info["label"] = "Alert"
        info["color"] = "orange"
        info["actions_required"] = ["Assemble response team", "Check muster roll", "Prepare equipment"]
        info["auto_notifications"] = ["Station Commander", "NCPOR HQ", "Medical Officer"]
    else:
        info["label"] = "Emergency"
        info["color"] = "red"
        info["actions_required"] = ["Initiate Evacuation Protocol", "Activate Emergency Beacons", "Full Muster"]
        info["auto_notifications"] = ["ALL STATION PERSONNEL", "NCPOR HQ", "Nearby Stations"]
        
    return info

def should_auto_escalate(incident: dict, elapsed_minutes: int, unaccounted_count: int) -> bool:
    if incident.get("escalation_level") == EscalationLevel.EMERGENCY:
        return False
    
    if elapsed_minutes > 30 and incident.get("escalation_level") == EscalationLevel.ADVISORY:
        return True
        
    if unaccounted_count > 0 and elapsed_minutes > 15:
        return True
        
    return False

def get_evacuation_recommendation(incident: dict, routes: list[dict]) -> dict:
    if not routes:
        return {"recommended_zone": "Unknown", "assembly_point": "Main Hall", "estimated_time_minutes": 5, "priority_zones": []}
        
    # Mock logic for recommendation
    best_route = routes[0]
    return {
        "recommended_zone": best_route.get("zone", "Alpha"),
        "assembly_point": best_route.get("assembly_point", "Safe Room"),
        "estimated_time_minutes": 10,
        "priority_zones": [best_route.get("zone")]
    }
