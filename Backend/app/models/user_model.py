from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    id: Optional[str] = None
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str  # student, hr, admin

    # Student fields
    academic_year: Optional[str] = None
    department: Optional[str] = None

    # HR fields
    company_name: Optional[str] = None

    # Common optional
    profile_pic: Optional[str] = None
