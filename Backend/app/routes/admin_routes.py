from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional, Literal
from bson import ObjectId
from datetime import datetime
from jose import jwt, JWTError
from pydantic import BaseModel

from app.config import JWT_SECRET, JWT_ALGORITHM
from app.database import (
    users_collection,
    internships_collection,
    applications_collection,
    notifications_collection,
)

router = APIRouter(prefix="/admin", tags=["Admin"])
security = HTTPBearer()


def require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or (role or "").lower() != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return {"email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---- Analytics ----
@router.get("/stats", response_model=dict)
async def get_stats(_: dict = Depends(require_admin)):
    total_users = users_collection.count_documents({})
    total_internships = internships_collection.count_documents({})
    total_applications = applications_collection.count_documents({})
    active_internships = internships_collection.count_documents({"status": "active"})
    return {
        "total_users": total_users,
        "total_internships": total_internships,
        "active_internships": active_internships,
        "total_applications": total_applications,
    }


# ---- Users ----
@router.get("/users", response_model=List[dict])
async def list_users(role: Optional[str] = Query(None, description="Filter by role"), _: dict = Depends(require_admin)):
    q = {"role": role} if role else {}
    docs = users_collection.find(q).limit(200)
    result: List[dict] = []
    for d in docs:
        result.append({
            "first_name": d.get("first_name"),
            "last_name": d.get("last_name"),
            "email": d.get("email"),
            "role": d.get("role"),
            "company_name": d.get("company_name"),
            "academic_year": d.get("academic_year"),
            "department": d.get("department"),
        })
    return result

@router.delete("/users/{email}", response_model=dict)
async def delete_user(email: str, _: dict = Depends(require_admin)):
    res = users_collection.delete_one({"email": email})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    # Optionally cascade delete: apps/messages not handled here
    return {"message": "User deleted"}


# ---- Internships moderation ----
@router.get("/internships", response_model=List[dict])
async def admin_list_internships(status: Optional[str] = None, _: dict = Depends(require_admin)):
    q = {"status": status} if status else {}
    cur = internships_collection.find(q).sort("posted_date", -1).limit(200)
    items: List[dict] = []
    for d in cur:
        items.append({
            "id": str(d.get("_id")),
            "title": d.get("title"),
            "company_name": d.get("company_name"),
            "status": d.get("status"),
            "mentor_email": d.get("mentor_email"),
            "posted_date": d.get("posted_date"),
            "location": d.get("location"),
            "duration": d.get("duration"),
            "stipend": d.get("stipend"),
            "skills": d.get("skills"),
            "deadline": d.get("deadline"),
        })
    return items


class AdminApplicationUpdate(BaseModel):
    status: Literal["pending", "approved", "rejected"]


@router.put("/applications/{application_id}/status", response_model=dict)
async def update_application_status(application_id: str, payload: AdminApplicationUpdate, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status_code=400, detail="Invalid application ID")
    res = applications_collection.update_one({"_id": ObjectId(application_id)}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application status updated"}


@router.delete("/applications/{application_id}", response_model=dict)
async def delete_application(application_id: str, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status_code=400, detail="Invalid application ID")
    res = applications_collection.delete_one({"_id": ObjectId(application_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application deleted"}

@router.put("/internships/{internship_id}/approve", response_model=dict)
async def approve_internship(internship_id: str, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    res = internships_collection.update_one({"_id": ObjectId(internship_id)}, {"$set": {"status": "active"}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {"message": "Internship approved"}

@router.delete("/internships/{internship_id}", response_model=dict)
async def remove_internship(internship_id: str, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    res = internships_collection.delete_one({"_id": ObjectId(internship_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Internship not found")
    applications_collection.delete_many({"internship_id": internship_id})
    return {"message": "Internship removed"}


class AdminInternshipUpdate(BaseModel):
    title: Optional[str] = None
    company_name: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    stipend: Optional[str] = None
    skills: Optional[str] = None
    deadline: Optional[str] = None
    status: Optional[str] = None


@router.get("/internships/{internship_id}", response_model=dict)
async def get_internship_detail(internship_id: str, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    d = internships_collection.find_one({"_id": ObjectId(internship_id)})
    if not d:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {
        "id": str(d.get("_id")),
        "title": d.get("title"),
        "company_name": d.get("company_name"),
        "status": d.get("status"),
        "mentor_email": d.get("mentor_email"),
        "posted_date": d.get("posted_date"),
        "location": d.get("location"),
        "duration": d.get("duration"),
        "stipend": d.get("stipend"),
        "skills": d.get("skills"),
        "deadline": d.get("deadline"),
        "description": d.get("description"),
    }


@router.put("/internships/{internship_id}/reject", response_model=dict)
async def reject_internship(internship_id: str, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    res = internships_collection.update_one({"_id": ObjectId(internship_id)}, {"$set": {"status": "rejected"}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {"message": "Internship rejected"}


@router.put("/internships/{internship_id}/update", response_model=dict)
async def update_internship(internship_id: str, payload: AdminInternshipUpdate, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    updates = {k: v for k, v in payload.dict().items() if v is not None}
    if not updates:
        return {"message": "No changes"}
    res = internships_collection.update_one({"_id": ObjectId(internship_id)}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {"message": "Internship updated"}


# ---- Applications oversight ----
@router.get("/applications", response_model=List[dict])
async def list_applications(status: Optional[str] = None, _: dict = Depends(require_admin)):
    q = {"status": status} if status else {}
    cur = applications_collection.find(q).sort("applied_date", -1).limit(200)
    items: List[dict] = []
    for a in cur:
        items.append({
            "id": str(a.get("_id")),
            "internship_id": a.get("internship_id"),
            "student_email": a.get("student_email"),
            "student_name": a.get("student_name"),
            "status": a.get("status"),
            "applied_date": a.get("applied_date"),
        })
    return items


# ---- Notifications ----
class BroadcastPayload(BaseModel):
    title: str
    message: str
    target: str = "all"
    role: str = None
    user_ids: list = []

class BroadcastResponse(BaseModel):
    count: int

@router.post("/notifications/broadcast", response_model=BroadcastResponse)
async def broadcast_notification(payload: BroadcastPayload, _: dict = Depends(require_admin)):
    title = payload.title
    message = payload.message
    if not title or not message:
        raise HTTPException(status_code=400, detail="Title and message are required")
    target: Literal["all", "role", "users"] = payload.target
    role = payload.role
    user_ids = payload.user_ids

    if target == "all":
        cursor = users_collection.find({}, {"email": 1})
    elif target == "role":
        cursor = users_collection.find({"role": role}, {"email": 1})
    elif target == "users":
        cursor = ({"email": e} for e in user_ids)
    else:
        raise HTTPException(status_code=400, detail="Invalid target")

    created = 0
    now = datetime.utcnow()
    bulk = []
    for u in cursor:
        email = u["email"] if isinstance(u, dict) else u.get("email")
        bulk.append({
            "user_id": email,
            "type": "system",
            "title": title,
            "message": message,
            "href": None,
            "read": False,
            "created_at": now,
            "updated_at": now,
        })
        created += 1
    if bulk:
        notifications_collection.insert_many(bulk)
    return BroadcastResponse(count=created)
