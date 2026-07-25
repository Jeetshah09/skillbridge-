from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Request schemas
class CreateInternshipSchema(BaseModel):
    title: str
    description: str
    company_name: str
    mentor_name: str
    mentor_year: Optional[str] = None
    mentor_department: Optional[str] = None
    duration_weeks: int
    stipend: int
    max_applicants: int
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    difficulty_level: str  # beginner, intermediate, advanced
    work_type: str  # remote, hybrid, onsite
    location: Optional[str] = None
    application_deadline: datetime
    start_date: Optional[datetime] = None
    additional_info: Optional[str] = None
    benefits: List[str] = []

class UpdateInternshipSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company_name: Optional[str] = None
    mentor_name: Optional[str] = None
    duration_weeks: Optional[int] = None
    stipend: Optional[int] = None
    max_applicants: Optional[int] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    difficulty_level: Optional[str] = None
    work_type: Optional[str] = None
    location: Optional[str] = None
    application_deadline: Optional[datetime] = None
    start_date: Optional[datetime] = None
    additional_info: Optional[str] = None
    benefits: Optional[List[str]] = None
    status: Optional[str] = None

class ApplyInternshipSchema(BaseModel):
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    motivation: Optional[str] = None
    relevant_experience: Optional[str] = None

class UpdateApplicationSchema(BaseModel):
    status: Optional[str] = None
    review_notes: Optional[str] = None

# Response schemas
class InternshipResponseSchema(BaseModel):
    id: str
    title: str
    description: str
    company_name: str
    mentor_name: str
    mentor_year: Optional[str] = None
    mentor_department: Optional[str] = None
    duration_weeks: int
    stipend: int
    max_applicants: int
    current_applicants: int
    required_skills: List[str]
    preferred_skills: List[str]
    difficulty_level: str
    work_type: str
    location: Optional[str] = None
    posted_date: Optional[datetime] = None
    application_deadline: datetime
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str
    additional_info: Optional[str] = None
    benefits: List[str]
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ApplicationResponseSchema(BaseModel):
    id: str
    internship_id: str
    internship_title: Optional[str] = None  # For response
    student_email: str
    student_name: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    status: str
    applied_date: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    reviewed_date: Optional[datetime] = None
    review_notes: Optional[str] = None
    motivation: Optional[str] = None
    relevant_experience: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
