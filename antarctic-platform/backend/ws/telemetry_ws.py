import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from simulators.telemetry_simulator import telemetry_subscribers, get_latest_telemetry

router = APIRouter()

@router.websocket("/{station_id}")
async def telemetry_websocket(websocket: WebSocket, station_id: str):
    await websocket.accept()
    
    if station_id not in telemetry_subscribers:
        telemetry_subscribers[station_id] = []
        
    queue = asyncio.Queue()
    telemetry_subscribers[station_id].append(queue)
    
    latest = get_latest_telemetry(station_id)
    if latest:
        # Convert datetime to string if needed
        data = latest.copy()
        if "timestamp" in data:
            data["timestamp"] = data["timestamp"].isoformat()
        await websocket.send_json(data)
        
    try:
        while True:
            data = await queue.get()
            if "timestamp" in data:
                data["timestamp"] = data["timestamp"].isoformat()
            await websocket.send_json(data)
    except WebSocketDisconnect:
        telemetry_subscribers[station_id].remove(queue)
        if not telemetry_subscribers[station_id]:
            del telemetry_subscribers[station_id]
