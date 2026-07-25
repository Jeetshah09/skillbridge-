from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional
from datetime import datetime
from bson import ObjectId

from app.config import JWT_SECRET, JWT_ALGORITHM
from app.database import internships_collection, applications_collection, users_collection

router = APIRouter(prefix="/hr", tags=["HR"]) 
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_collection.find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_hr(user: dict = Depends(get_current_user)):
    role = (user.get("role") or "").lower()
    if role not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR/Admin allowed")
    return user


@router.get("/profile", response_model=dict)
async def hr_profile(current_user: dict = Depends(require_hr)):
    # Return basic recruiter/company info; adjust fields as available
    return {
        "email": current_user.get("email"),
        "first_name": current_user.get("first_name"),
        "last_name": current_user.get("last_name"),
        "company_name": current_user.get("company_name") or current_user.get("organization"),
        "role": current_user.get("role"),
    }


@router.get("/internships/stats", response_model=dict)
async def hr_internship_stats(current_user: dict = Depends(require_hr)):
    email = current_user["email"]
    total_posts = internships_collection.count_documents({"mentor_email": email})
    active_posts = internships_collection.count_documents({"mentor_email": email, "status": "active"})
    now = datetime.utcnow()
    expired_posts = internships_collection.count_documents({
        "mentor_email": email,
        "$or": [
            {"status": "expired"},
            {"application_deadline": {"$lt": now}},
        ],
    })

    # Get all internship IDs for HR
    my_ids = [str(doc["_id"]) for doc in internships_collection.find({"mentor_email": email}, {"_id": 1})]
    apps_query = {"internship_id": {"$in": my_ids}} if my_ids else {"internship_id": "__none__"}
    applications_received = applications_collection.count_documents(apps_query)
    approved_applications = applications_collection.count_documents({**apps_query, "status": "approved"})

    return {
        "total_posts": total_posts,
        "active_posts": active_posts,
        "expired_posts": expired_posts,
        "applications_received": applications_received,
        "approved_applications": approved_applications,
    }


@router.get("/internships", response_model=list)
async def hr_recent_internships(limit: int = Query(5, ge=1, le=10), current_user: dict = Depends(require_hr)):
    email = current_user["email"]
    cur = internships_collection.find({"mentor_email": email}).sort("posted_date", -1).limit(limit)
    items = []
    for d in cur:
        d["id"] = str(d["_id"])
        items.append({
            "id": d["id"],
            "title": d.get("title"),
            "company_name": d.get("company_name"),
            "status": d.get("status"),
            "posted_date": d.get("posted_date"),
        })
    return items


@router.get("/applications", response_model=list)
async def hr_recent_applications(limit: int = Query(5, ge=1, le=10), current_user: dict = Depends(require_hr)):
    email = current_user["email"]
    # Get internship ids for this HR
    my_ids = [str(doc["_id"]) for doc in internships_collection.find({"mentor_email": email}, {"_id": 1})]
    if not my_ids:
        return []
    cur = applications_collection.find({"internship_id": {"$in": my_ids}}).sort("applied_date", -1).limit(limit)
    items = []
    for a in cur:
        a_id = str(a["_id"])
        title = a.get("internship_title")
        if not title:
            # try to fetch title lazily
            try:
                i = internships_collection.find_one({"_id": ObjectId(a.get("internship_id"))})
                if i:
                    title = i.get("title")
            except Exception:
                pass
        items.append({
            "id": a_id,
            "internship_id": a.get("internship_id"),
            "internship_title": title,
            "student_name": a.get("student_name"),
            "status": a.get("status"),
            "applied_date": a.get("applied_date"),
        })
    return items
