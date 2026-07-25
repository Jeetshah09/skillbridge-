from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

NotificationType = Literal[
    "system",
    "application_status",
    "new_application",
    "reminder",
]


class NotificationCreateSchema(BaseModel):
    user_id: str
    type: NotificationType = "system"
    title: str
    message: str
    href: Optional[str] = None


class NotificationSchema(NotificationCreateSchema):
    id: Optional[str] = Field(alias="_id", default=None)
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationUpdateSchema(BaseModel):
    read: Optional[bool] = None

