def normalize_station_id(station_id: str) -> str:
    """Normalize station IDs so 'STA-001' maps to 'maitri' and 'STA-002' maps to 'bharati'."""
    s = (station_id or "").lower().strip()
    if s in ["sta-001", "sta_001", "sta001", "maitri", "station-1"]:
        return "maitri"
    if s in ["sta-002", "sta_002", "sta002", "bharati", "station-2"]:
        return "bharati"
    return s
