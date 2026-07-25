from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime
from bson import ObjectId
from typing import List

from app.config import JWT_SECRET, JWT_ALGORITHM
from app.database import users_collection, messages_collection, conversations_collection
from app.schemas.message_schema import (
    SendMessageSchema,
    MessageResponseSchema,
    ConversationResponseSchema,
)

router = APIRouter(prefix="/messages", tags=["Messages"])
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
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


@router.get("/conversations", response_model=List[ConversationResponseSchema])
async def list_conversations(current_user: dict = Depends(get_current_user)):
    cur = conversations_collection.find({"participant_emails": current_user["email"]}).sort("last_message_at", -1)
    result: List[ConversationResponseSchema] = []
    for doc in cur:
        doc_id = str(doc["_id"])
        result.append(
            ConversationResponseSchema(
                id=doc_id,
                participant_emails=doc.get("participant_emails", []),
                last_message=doc.get("last_message"),
                last_message_at=doc.get("last_message_at"),
            )
        )
    return result


@router.post("/start", response_model=dict)
async def start_conversation(recipient_email: str, current_user: dict = Depends(get_current_user)):
    if not users_collection.find_one({"email": recipient_email}):
        raise HTTPException(status_code=404, detail="Recipient not found")

    emails = sorted([current_user["email"], recipient_email])
    existing = conversations_collection.find_one({"participant_emails": emails})
    if existing:
        return {"conversation_id": str(existing["_id"]) }

    doc = {
        "participant_emails": emails,
        "last_message": None,
        "last_message_at": datetime.utcnow(),
        "created_at": datetime.utcnow(),
    }
    res = conversations_collection.insert_one(doc)
    return {"conversation_id": str(res.inserted_id)}


@router.get("/{conversation_id}", response_model=List[MessageResponseSchema])
async def get_messages(conversation_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(status_code=400, detail="Invalid conversation ID")

    conv = conversations_collection.find_one({"_id": ObjectId(conversation_id)})
    if not conv or current_user["email"] not in conv.get("participant_emails", []):
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Ensure we're getting all messages for this conversation
    msgs = messages_collection.find({"conversation_id": conversation_id}).sort("created_at", 1)
    result: List[MessageResponseSchema] = []
    for m in msgs:
        # Ensure all message fields are properly extracted
        result.append(
            MessageResponseSchema(
                id=str(m["_id"]),
                conversation_id=m["conversation_id"],
                sender_email=m["sender_email"],
                recipient_email=m["recipient_email"],
                content=m["content"],
                created_at=m["created_at"],
            )
        )
    # Debug log the number of messages found
    print(f"Found {len(result)} messages for conversation {conversation_id}")
    return result


@router.post("/{conversation_id}", response_model=dict)
async def send_message(conversation_id: str, payload: SendMessageSchema, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(status_code=400, detail="Invalid conversation ID")

    conv = conversations_collection.find_one({"_id": ObjectId(conversation_id)})
    if not conv or current_user["email"] not in conv.get("participant_emails", []):
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Determine recipient
    participants = conv["participant_emails"]
    recipient = participants[0] if participants[1] == current_user["email"] else participants[1]

    doc = {
        "conversation_id": conversation_id,
        "sender_email": current_user["email"],
        "recipient_email": recipient,
        "content": payload.content,
        "created_at": datetime.utcnow(),
    }
    res = messages_collection.insert_one(doc)

    conversations_collection.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"last_message": payload.content, "last_message_at": doc["created_at"]}},
    )

    return {"message_id": str(res.inserted_id)}
