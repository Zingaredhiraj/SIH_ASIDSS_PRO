"""
Audit Service — writes every mutating action to audit_logs collection.
Called from every router that performs state-changing operations.
Never throws — logging failures must not break the primary operation.
"""
from datetime import datetime


async def log_action(
    user_id: str,
    role: str,
    action: str,
    resource: str,
    result: str,
    metadata: dict = None,
) -> None:
    """
    Persist an audit log entry.

    Args:
        user_id:  The authenticated user's ID string.
        role:     The user's role (admin, operator, etc.).
        action:   Action code, e.g. 'TRIGGER_INCIDENT', 'MARK_SAFE', 'LOGIN'.
        resource: Affected resource, e.g. 'incident:abc123', 'crew:crew_007'.
        result:   'SUCCESS' | 'FAILURE'
        metadata: Optional extra context dict.
    """
    try:
        from db.mongo import get_audit_logs_col
        col = get_audit_logs_col()
        doc = {
            "user_id": str(user_id),
            "role": role,
            "action": action,
            "resource": resource,
            "result": result,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow(),
            "dataSource": "audit_service",
            "isSimulation": True,
        }
        await col.insert_one(doc)
    except Exception as e:
        # Logging must never raise — swallow and print only
        print(f"[AUDIT] Failed to log action {action} by {user_id}: {e}")
