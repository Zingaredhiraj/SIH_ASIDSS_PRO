import asyncio
from core.security import hash_password
from db.mongo import (
    get_client, get_db, get_stations_col, get_users_col, get_roles_col,
    get_personnel_col, get_shift_schedule_col, get_access_points_col,
    get_access_events_col, get_resupply_col, get_inventory_col, get_weather_col,
    get_hazard_thresholds_col, get_incidents_col, get_muster_col,
    get_evacuation_routes_col, get_sop_documents_col, get_assets_3d_col,
    get_asset_status_col, get_telemetry_col
)
from core.rbac import PERMISSIONS
from datetime import datetime, timedelta
import random

async def seed():
    print("Connecting to DB...")
    db = get_db()
    cols = await db.list_collection_names()
    print("Clearing collections...")
    for c in cols:
        await db[c].delete_many({})
        
    print("Seeding stations...")
    stations = [
        {"station_id": "maitri", "name": "Maitri", "lat": -70.7669, "lon": 11.8234, "status": "operational"},
        {"station_id": "bharati", "name": "Bharati", "lat": -69.4075, "lon": 76.1921, "status": "operational"}
    ]
    await get_stations_col().insert_many(stations)
    
    print("Seeding roles...")
    roles = [{"name": r, "permissions": list(p)} for r, p in PERMISSIONS.items()]
    await get_roles_col().insert_many(roles)
    
    print("Seeding users...")
    users = [
        {"email": "admin@antarctic.in", "hashed_password": hash_password("Admin@1234"), "role": "admin", "station": "maitri"},
        {"email": "operator@antarctic.in", "hashed_password": hash_password("Operator@1234"), "role": "operator", "station": "maitri"},
        {"email": "scientist@antarctic.in", "hashed_password": hash_password("Scientist@1234"), "role": "scientist", "station": "bharati"},
        {"email": "security@antarctic.in", "hashed_password": hash_password("Security@1234"), "role": "security_officer", "station": "maitri"},
        {"email": "hq@ncpor.gov.in", "hashed_password": hash_password("NCPOR@1234"), "role": "ncpor_hq", "station": None}
    ]
    await get_users_col().insert_many(users)

    print("Seeding shifts & personnel...")
    shifts = []
    personnel = []
    muster = []
    roles_list = ["Station Commander", "Chief Engineer", "Meteorologist", "Medical Officer", "Glaciologist", "Geophysicist", "Cook", "Technician", "Radio Operator"]
    depts = ["Operations", "Science", "Medical", "Logistics"]
    shifts_names = ["Alpha", "Bravo", "Charlie"]
    
    for st in ["maitri", "bharati"]:
        shifts.extend([
            {"station_id": st, "name": "Alpha", "start_time": "0600", "end_time": "1400"},
            {"station_id": st, "name": "Bravo", "start_time": "1400", "end_time": "2200"},
            {"station_id": st, "name": "Charlie", "start_time": "2200", "end_time": "0600"}
        ])
        
        count = 25 if st == "maitri" else 15
        for i in range(count):
            p = {
                "station_id": st,
                "name": f"Person {i} {st}",
                "role": random.choice(roles_list),
                "department": random.choice(depts),
                "status": random.choice(["ON_DUTY", "OFF_DUTY", "IN_FIELD_OPS"]),
                "shift": random.choice(shifts_names),
                "sector": f"Sector-{random.randint(1,5)}"
            }
            personnel.append(p)
            
    await get_shift_schedule_col().insert_many(shifts)
    res = await get_personnel_col().insert_many(personnel)
    
    for i, pid in enumerate(res.inserted_ids):
        muster.append({
            "station_id": personnel[i]["station_id"],
            "personnel_id": str(pid),
            "name": personnel[i]["name"],
            "status": "SAFE"
        })
    await get_muster_col().insert_many(muster)

    print("Seeding access points & events...")
    points = []
    ap_names = ["Exterior Hatch North", "Exterior Hatch South", "Generator Room", "Fuel Storage", "Science Lab", "Comms Room"]
    for st in ["maitri", "bharati"]:
        for ap in ap_names:
            points.append({
                "station_id": st,
                "name": ap,
                "status": random.choice(["SECURE", "OPEN", "ALERT"]),
                "access_level": random.randint(1, 3),
                "risk_level": random.choice(["LOW", "MEDIUM", "HIGH"])
            })
    res_ap = await get_access_points_col().insert_many(points)
    
    events = []
    for st in ["maitri", "bharati"]:
        st_points = [p for p in points if p["station_id"] == st]
        st_personnel = [p for i, p in enumerate(personnel) if p["station_id"] == st and res.inserted_ids[i]]
        
        for _ in range(50):
            p = random.choice(st_personnel)
            ap = random.choice(st_points)
            events.append({
                "station_id": st,
                "personnel_id": str(res.inserted_ids[personnel.index(p)]),
                "point_name": ap["name"],
                "authorized": random.choice([True, True, True, False]),
                "timestamp": datetime.utcnow() - timedelta(minutes=random.randint(1, 1440))
            })
    await get_access_events_col().insert_many(events)

    print("Seeding logistics...")
    resupply = []
    for st in ["maitri", "bharati"]:
        resupply.extend([
            {"station_id": st, "status": "DELIVERED", "date": datetime.utcnow() - timedelta(days=30), "cargo": "Fuel & Food"},
            {"station_id": st, "status": "EN_ROUTE", "date": datetime.utcnow() + timedelta(days=5), "cargo": "Science Equipment"},
            {"station_id": st, "status": "PLANNED", "date": datetime.utcnow() + timedelta(days=60), "cargo": "Winter Provisions"}
        ])
    await get_resupply_col().insert_many(resupply)

    inventory = []
    for st in ["maitri", "bharati"]:
        items = [
            ("Diesel Fuel", 80000, 100000, "L", 20000),
            ("Food Supplies", 4000, 5000, "kg", 1000),
            ("Fresh Water", 15000, 20000, "L", 5000),
            ("Medical Supplies", 80, 100, "boxes", 20),
            ("Scientific Equipment", 95, 100, "units", 10)
        ]
        for name, current, cap, unit, thres in items:
            inventory.append({
                "station_id": st,
                "name": name,
                "category": name,
                "current_stock": current,
                "capacity": cap,
                "unit": unit,
                "reorder_threshold": thres
            })
    await get_inventory_col().insert_many(inventory)

    print("Seeding weather & hazards...")
    weather = []
    now = datetime.utcnow()
    for st in ["maitri", "bharati"]:
        for h in range(7*24):
            weather.append({
                "station_id": st,
                "timestamp": now - timedelta(hours=h),
                "temperature": random.uniform(-40, -15),
                "wind_speed": random.uniform(10, 80),
                "visibility": random.uniform(0.1, 10),
                "pressure": random.uniform(950, 1013),
                "snowfall": random.uniform(0, 5)
            })
    await get_weather_col().insert_many(weather)

    thresholds = []
    for st in ["maitri", "bharati"]:
        thresholds.extend([
            {"station_id": st, "metric": "wind_speed", "operator": ">", "value": 60, "hazard_type": "STORM_WARNING", "severity": "HIGH"},
            {"station_id": st, "metric": "temperature", "operator": "<", "value": -35, "hazard_type": "EXTREME_COLD", "severity": "HIGH"},
            {"station_id": st, "metric": "visibility", "operator": "<", "value": 0.5, "hazard_type": "WHITEOUT", "severity": "HIGH"},
            {"station_id": st, "metric": "fuel_pct", "operator": "<", "value": 20, "hazard_type": "FUEL_CRITICAL", "severity": "HIGH"}
        ])
    await get_hazard_thresholds_col().insert_many(thresholds)

    print("Seeding incidents...")
    incidents = []
    for st in ["maitri", "bharati"]:
        incidents.append({
            "station_id": st,
            "type": "EQUIPMENT_FAILURE",
            "severity": "MEDIUM",
            "status": "RESOLVED",
            "escalation_level": 1,
            "timeline": [{"event": "Resolved", "timestamp": now}],
            "description": "Historical incident"
        })
        incidents.append({
            "station_id": st,
            "type": "MEDICAL_EMERGENCY",
            "severity": "LOW",
            "status": "RESOLVED",
            "escalation_level": 1,
            "timeline": [{"event": "Resolved", "timestamp": now}],
            "description": "Historical incident"
        })
    incidents.append({
        "station_id": "maitri",
        "type": "FIRE",
        "severity": "HIGH",
        "status": "ACTIVE",
        "escalation_level": 2,
        "timeline": [{"event": "Triggered", "timestamp": now}],
        "description": "Active fire in generator room"
    })
    await get_incidents_col().insert_many(incidents)

    print("Seeding evacuation routes...")
    routes = []
    for st in ["maitri", "bharati"]:
        for zone in ["Zone A", "Zone B", "Zone C"]:
            routes.append({
                "station_id": st,
                "zone": zone,
                "path_geometry": [[0,0], [1,1], [2,2]],
                "assembly_point": f"{zone} Assembly"
            })
    await get_evacuation_routes_col().insert_many(routes)

    print("Seeding SOP documents...")
    sops = [
        {"title": "Fire Emergency Procedure", "category": "Emergency", "chunks": ["Step 1: Sound alarm.", "Step 2: Evacuate area.", "Step 3: Use extinguisher if safe."]},
        {"title": "Medical Emergency Protocol", "category": "Medical", "chunks": ["Step 1: Contact Medical Officer.", "Step 2: Provide First Aid.", "Step 3: Prepare for medevac."]},
        {"title": "Blizzard/Whiteout Protocol", "category": "Weather", "chunks": ["Step 1: Recall all field teams.", "Step 2: Secure exterior doors.", "Step 3: Restrict outside movement."]},
        {"title": "Fuel Leak Emergency", "category": "Emergency", "chunks": ["Step 1: Stop transfer.", "Step 2: Contain spill.", "Step 3: Notify environmental officer."]},
        {"title": "Structural Damage Protocol", "category": "Infrastructure", "chunks": ["Step 1: Assess damage.", "Step 2: Isolate area.", "Step 3: Shore up structure if safe."]},
        {"title": "Communications Failure Protocol", "category": "IT", "chunks": ["Step 1: Switch to backup radio.", "Step 2: Check antenna connections.", "Step 3: Establish satellite link."]},
        {"title": "Generator Failure Protocol", "category": "Power", "chunks": ["Step 1: Start backup generator.", "Step 2: Shed non-essential load.", "Step 3: Troubleshoot main unit."]},
        {"title": "Evacuation Procedure", "category": "Emergency", "chunks": ["Step 1: Don extreme weather gear.", "Step 2: Proceed to assembly point.", "Step 3: Await transport."]}
    ]
    await get_sop_documents_col().insert_many(sops)

    print("Seeding Digital Twin Assets...")
    assets_3d = []
    asset_status = []
    types = [
        ("Generator Room", "generator"), ("Generator Room", "fuel_tank"),
        ("Power Control", "solar_array"), ("Power Control", "wind_turbine"), ("Power Control", "battery_bank"),
        ("Comms Tower", "antenna"), ("Comms Tower", "radio_unit"),
        ("Science Lab", "weather_station"), ("Science Lab", "seismograph"),
        ("Living Quarters", "heating_unit"), ("Storage", "emergency_supplies")
    ]
    for st in ["maitri", "bharati"]:
        for parent, typ in types:
            assets_3d.append({
                "station_id": st,
                "parent_area": parent,
                "type": typ,
                "model_ref": f"{typ}_model_v1",
                "position": {"x": random.uniform(-10, 10), "y": random.uniform(0, 5), "z": random.uniform(-10, 10)}
            })
    res_assets = await get_assets_3d_col().insert_many(assets_3d)
    
    for i, aid in enumerate(res_assets.inserted_ids):
        asset_status.append({
            "station_id": assets_3d[i]["station_id"],
            "asset_id": str(aid),
            "status": random.choice(["OPERATIONAL", "OPERATIONAL", "WARNING"]),
            "metrics": {"temp": random.uniform(10, 40)}
        })
    await get_asset_status_col().insert_many(asset_status)

    print("Seeding historical telemetry...")
    telemetry = []
    for st in ["maitri", "bharati"]:
        for m in range(24 * 12): # Every 5 min for 24h
            ts = now - timedelta(minutes=m*5)
            telemetry.append({
                "station_id": st,
                "timestamp": ts,
                "solar_kw": random.uniform(0, 45) if st == "maitri" else random.uniform(0, 35),
                "wind_kw": random.uniform(5, 20) if st == "maitri" else random.uniform(8, 25),
                "diesel_kw": random.uniform(30, 60) if st == "maitri" else random.uniform(25, 50),
                "load_kw": random.uniform(50, 80) if st == "maitri" else random.uniform(45, 70),
                "fuel_pct": random.uniform(65, 72) if st == "maitri" else random.uniform(45, 55),
                "water_pct": random.uniform(70, 75) if st == "maitri" else random.uniform(60, 68),
                "food_pct": random.uniform(78, 85) if st == "maitri" else random.uniform(72, 80)
            })
    await get_telemetry_col().insert_many(telemetry)

    print("Seed complete!")

if __name__ == "__main__":
    asyncio.run(seed())
