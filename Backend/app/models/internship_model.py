from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Internship(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    company_name: str
    mentor_email: EmailStr  # HR/mentor who posted this
    mentor_name: str
    mentor_year: Optional[str] = None
    mentor_department: Optional[str] = None
    
    # Internship details
    duration_weeks: int
    stipend: int
    max_applicants: int
    current_applicants: int = 0
    
    # Skills and requirements
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    difficulty_level: str  # beginner, intermediate, advanced
    
    # Location and type
    work_type: str  # remote, hybrid, onsite
    location: Optional[str] = None
    
    # Dates
    posted_date: Optional[datetime] = None
    application_deadline: datetime
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    
    # Status
    status: str = "active"  # active, closed, completed
    
    # Additional info
    additional_info: Optional[str] = None
    benefits: List[str] = []
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Application(BaseModel):
    id: Optional[str] = None
    internship_id: str
    student_email: EmailStr
    student_name: str
    
    # Application details
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    
    # Application status
    status: str = "pending"  # pending, reviewed, selected, rejected
    applied_date: Optional[datetime] = None
    
    # Review details
    reviewed_by: Optional[str] = None  # mentor_email
    reviewed_date: Optional[datetime] = None
    review_notes: Optional[str] = None
    
    # Student additional info
    motivation: Optional[str] = None
    relevant_experience: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
