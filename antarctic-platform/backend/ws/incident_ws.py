import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from db.mongo import get_incidents_col

router = APIRouter()
incident_subscribers = {}

async def broadcast_incident(station_id: str, data: dict):
    if station_id in incident_subscribers:
        for queue in incident_subscribers[station_id]:
            await queue.put(data)

@router.websocket("/{station_id}")
async def incident_websocket(websocket: WebSocket, station_id: str):
    await websocket.accept()
    
    if station_id not in incident_subscribers:
        incident_subscribers[station_id] = []
        
    queue = asyncio.Queue()
    incident_subscribers[station_id].append(queue)
    
    col = get_incidents_col()
    active_incidents = await col.find({"station_id": station_id, "status": "ACTIVE"}).to_list(length=None)
    for inc in active_incidents:
        inc["_id"] = str(inc["_id"])
        if "timeline" in inc:
            for t in inc["timeline"]:
                if "timestamp" in t: t["timestamp"] = t["timestamp"].isoformat()
        await websocket.send_json(inc)
        
    try:
        while True:
            data = await queue.get()
            if "_id" in data: data["_id"] = str(data["_id"])
            await websocket.send_json(data)
    except WebSocketDisconnect:
        incident_subscribers[station_id].remove(queue)
        if not incident_subscribers[station_id]:
            del incident_subscribers[station_id]
