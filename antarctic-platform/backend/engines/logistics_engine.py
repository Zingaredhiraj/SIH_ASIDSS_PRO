def calculate_days_remaining(inventory: list[dict], burn_rates: dict) -> list[dict]:
    enriched = []
    for item in inventory:
        category = item.get("category", "").lower()
        burn_rate = 0
        if "fuel" in category: burn_rate = burn_rates.get("fuel_burn_per_day_pct", 2.5)
        elif "water" in category: burn_rate = burn_rates.get("water_burn_per_day_pct", 1.2)
        elif "food" in category: burn_rate = burn_rates.get("food_burn_per_day_pct", 0.8)
        else: burn_rate = 0.5 
        
        stock_pct = (item.get("current_stock", 0) / max(item.get("capacity", 1), 1)) * 100 if item.get("capacity") else item.get("current_stock", 100)
        
        days = float('inf') if burn_rate == 0 else stock_pct / burn_rate
        
        status = "OK"
        if days < 14: status = "CRITICAL"
        elif days < 30: status = "LOW"
        
        enriched_item = item.copy()
        if "_id" in enriched_item: enriched_item["_id"] = str(enriched_item["_id"])
        enriched_item["days_remaining"] = round(days, 1)
        enriched_item["status"] = status
        enriched.append(enriched_item)
        
    return enriched

def assess_resupply_urgency(inventory_with_days: list) -> dict:
    critical_items = [i for i in inventory_with_days if i.get("status") == "CRITICAL"]
    warning_items = [i for i in inventory_with_days if i.get("status") == "LOW"]
    
    overall_status = "NORMAL"
    if critical_items: overall_status = "URGENT_RESUPPLY_NEEDED"
    elif warning_items: overall_status = "WARNING_MONITOR_STOCK"
    
    return {
        "overall_status": overall_status,
        "critical_items": critical_items,
        "warning_items": warning_items
    }
