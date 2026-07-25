from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from app.database import notifications_collection
from app.schemas.notification_schema import (
    NotificationCreateSchema,
    NotificationSchema,
    NotificationUpdateSchema,
)
from bson import ObjectId
from datetime import datetime
from jose import jwt, JWTError
from app.config import JWT_SECRET, JWT_ALGORITHM

router = APIRouter(prefix="/notifications", tags=["Notifications"])
security = HTTPBearer()


def serialize_notification(doc) -> dict:
    if not doc:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/", response_model=List[NotificationSchema])
async def list_my_notifications(current_user: dict = Depends(get_current_user)):
    docs = list(
        notifications_collection.find({"user_id": current_user["email"]}).sort("created_at", -1)
    )
    return [serialize_notification(d) for d in docs]


@router.post("/", response_model=NotificationSchema)
async def create_notification(payload: NotificationCreateSchema):
    doc = payload.dict()
    doc["read"] = False
    doc["created_at"] = datetime.utcnow()
    doc["updated_at"] = datetime.utcnow()
    result = notifications_collection.insert_one(doc)
    created = notifications_collection.find_one({"_id": result.inserted_id})
    return serialize_notification(created)


@router.put("/{notification_id}", response_model=NotificationSchema)
async def update_notification(notification_id: str, payload: NotificationUpdateSchema):
    update = {k: v for k, v in payload.dict().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    update["updated_at"] = datetime.utcnow()
    result = notifications_collection.find_one_and_update(
        {"_id": ObjectId(notification_id)},
        {"$set": update},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found")
    return serialize_notification(result)


@router.post("/mark-all-read", response_model=int)
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    res = notifications_collection.update_many(
        {"user_id": current_user["email"], "read": False}, {"$set": {"read": True, "updated_at": datetime.utcnow()}}
    )
    return res.modified_count


