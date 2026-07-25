from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import List
from bson import ObjectId
from datetime import datetime

from app.config import JWT_SECRET, JWT_ALGORITHM
from app.database import learning_posts_collection, users_collection

router = APIRouter(prefix="/learn", tags=["LearningHub"])
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

@router.post("/posts", response_model=dict)
def create_post(payload: dict, current_user: dict = Depends(get_current_user)):
    title = (payload.get("title") or "").strip()
    content = (payload.get("content") or "").strip()
    kind = (payload.get("type") or "").strip().lower()
    url = (payload.get("url") or "").strip()
    if not title or not content:
        raise HTTPException(status_code=400, detail="title and content are required")
    if kind and kind not in ["tutorial", "blog", "video", "notes", "other"]:
        kind = "other"
    doc = {
        "title": title,
        "content": content,
        "type": kind or "other",
        "url": url,
        "tags": payload.get("tags") or [],
        "author_email": current_user.get("email"),
        "author_name": (current_user.get("first_name") or "") + (" " + current_user.get("last_name") if current_user.get("last_name") else ""),
        "created_at": datetime.utcnow().isoformat(),
    }
    res = learning_posts_collection.insert_one(doc)
    return {"id": str(res.inserted_id), **{k: v for k, v in doc.items() if k != "_id"}}

@router.get("/posts", response_model=List[dict])
def list_posts(limit: int = 50, skip: int = 0):
    cur = learning_posts_collection.find({}).sort("created_at", -1).skip(skip).limit(min(limit, 100))
    out = []
    for d in cur:
        d["id"] = str(d["_id"])
        del d["_id"]
        out.append(d)
    return out

@router.get("/posts/{post_id}", response_model=dict)
def get_post(post_id: str):
    try:
        obj_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="invalid id")
    doc = learning_posts_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail="not found")
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
