from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from core.security import verify_password, create_access_token, create_refresh_token, get_current_user
from core.rbac import require_permission
from db.mongo import get_users_col, get_roles_col, get_audit_logs_col
from services.audit_service import log_action

router = APIRouter(tags=["Admin & Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str = ""
    email: str
    password: str
    role: str = "operator"
    station: str = "maitri"

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/auth/register")
async def register(req: RegisterRequest):
    from core.security import hash_password
    col = get_users_col()
    
    clean_email = req.email.strip().lower()
    if not clean_email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
        
    existing = await col.find_one({"email": clean_email})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    
    valid_roles = ["admin", "operator", "scientist", "security_officer", "ncpor_hq"]
    assigned_role = req.role if req.role in valid_roles else "operator"
    display_name = req.name.strip() if req.name.strip() else clean_email.split("@")[0].capitalize()
    
    user_doc = {
        "name": display_name,
        "email": clean_email,
        "hashed_password": hash_password(req.password),
        "role": assigned_role,
        "station": req.station or "maitri"
    }
    
    res = await col.insert_one(user_doc)
    user_doc["_id"] = str(res.inserted_id)
    del user_doc["hashed_password"]
    
    access_token = create_access_token({"sub": user_doc["email"]})
    refresh_token = create_refresh_token({"sub": user_doc["email"]})
    
    await log_action(user_doc["_id"], user_doc["role"], "REGISTER", "SYSTEM", "SUCCESS")
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_doc,
        "message": "Account created successfully"
    }

@router.post("/auth/login")
async def login(req: LoginRequest):
    col = get_users_col()
    user = await col.find_one({"email": req.email})
    
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token = create_access_token({"sub": user["email"]})
    refresh_token = create_refresh_token({"sub": user["email"]})
    
    user["_id"] = str(user["_id"])
    del user["hashed_password"]
    
    await log_action(user["_id"], user["role"], "LOGIN", "SYSTEM", "SUCCESS")
    
    return {"access_token": access_token, "refresh_token": refresh_token, "user": user}

@router.post("/auth/refresh")
async def refresh(req: RefreshRequest):
    from core.security import verify_token
    payload = verify_token(req.refresh_token)
    access_token = create_access_token({"sub": payload.get("sub")})
    return {"access_token": access_token}

@router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = current_user.copy()
    user["_id"] = str(user["_id"])
    del user["hashed_password"]
    return {"user": user}

@router.get("/admin/users")
async def list_users(current_user: dict = Depends(require_permission("MANAGE_USERS"))):
    col = get_users_col()
    users = await col.find({}).to_list(length=None)
    for u in users: 
        u["_id"] = str(u["_id"])
        if "hashed_password" in u: del u["hashed_password"]
    return {"users": users}

@router.post("/admin/users")
async def create_user(user_data: dict, current_user: dict = Depends(require_permission("MANAGE_USERS"))):
    from core.security import hash_password
    col = get_users_col()
    
    if await col.find_one({"email": user_data["email"]}):
        raise HTTPException(400, "User exists")
        
    user_data["hashed_password"] = hash_password(user_data["password"])
    del user_data["password"]
    
    res = await col.insert_one(user_data)
    user_data["_id"] = str(res.inserted_id)
    del user_data["hashed_password"]
    return {"user": user_data}

@router.get("/admin/roles")
async def get_roles(current_user: dict = Depends(require_permission("MANAGE_ROLES"))):
    col = get_roles_col()
    roles = await col.find({}).to_list(length=None)
    for r in roles: r["_id"] = str(r["_id"])
    return {"roles": roles}

@router.get("/admin/audit")
async def get_audit_log(limit: int = 100, current_user: dict = Depends(require_permission("VIEW_AUDIT_LOG"))):
    col = get_audit_logs_col()
    logs = await col.find({}).sort("timestamp", -1).limit(limit).to_list(length=None)
    for l in logs: l["_id"] = str(l["_id"])
    return {"logs": logs}
