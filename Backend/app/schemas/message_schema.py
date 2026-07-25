from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class SendMessageSchema(BaseModel):
    content: str


class MessageResponseSchema(BaseModel):
    id: str
    conversation_id: str
    sender_email: EmailStr
    recipient_email: EmailStr
    content: str
    created_at: datetime


class ConversationResponseSchema(BaseModel):
    id: str
    participant_emails: List[EmailStr]
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
