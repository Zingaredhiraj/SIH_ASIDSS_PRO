from fastapi import Depends, HTTPException, status
from core.security import get_current_user

PERMISSIONS = {
    "admin": {"VIEW_DASHBOARD", "VIEW_PERSONNEL", "VIEW_SECURITY", "VIEW_LOGISTICS", "VIEW_ENVIRONMENT", "USE_POLAR_AI", "TRIGGER_INCIDENT", "ACK_INCIDENT", "VIEW_DIGITAL_TWIN", "MANAGE_USERS", "MANAGE_ROLES", "VIEW_AUDIT_LOG", "VIEW_EMERGENCY"},
    "operator": {"VIEW_DASHBOARD", "VIEW_PERSONNEL", "VIEW_SECURITY", "VIEW_LOGISTICS", "VIEW_ENVIRONMENT", "USE_POLAR_AI", "TRIGGER_INCIDENT", "ACK_INCIDENT", "VIEW_DIGITAL_TWIN", "VIEW_EMERGENCY", "VIEW_AUDIT_LOG"},
    "scientist": {"VIEW_DASHBOARD", "VIEW_ENVIRONMENT", "USE_POLAR_AI", "VIEW_DIGITAL_TWIN", "VIEW_PERSONNEL"},
    "security_officer": {"VIEW_DASHBOARD", "VIEW_PERSONNEL", "VIEW_SECURITY", "USE_POLAR_AI", "TRIGGER_INCIDENT", "ACK_INCIDENT", "VIEW_DIGITAL_TWIN", "VIEW_EMERGENCY"},
    "ncpor_hq": {"VIEW_DASHBOARD", "VIEW_PERSONNEL", "VIEW_LOGISTICS", "VIEW_ENVIRONMENT", "VIEW_DIGITAL_TWIN", "VIEW_EMERGENCY", "VIEW_AUDIT_LOG", "USE_POLAR_AI"}
}

def require_permission(permission: str):
    async def permission_dependency(current_user: dict = Depends(get_current_user)):
        role = current_user.get("role")
        if role not in PERMISSIONS or permission not in PERMISSIONS[role]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required permission: {permission}"
            )
        return current_user
    return permission_dependency
