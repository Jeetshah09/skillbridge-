from fastapi import APIRouter, HTTPException
from app.services.skill_matching_service import SkillMatchingService
from app.database import users_collection
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/skill-matching", tags=["Skill Matching"])

# Pydantic models for responses
class SkillMatchResponse(BaseModel):
    internship_id: str
    title: str
    company_name: str
    description: str
    required_skills: List[str]
    preferred_skills: List[str]
    duration_weeks: int
    stipend: int
    work_type: str
    location: str
    application_deadline: str
    start_date: str
    end_date: str
    difficulty_level: str
    benefits: List[str]
    match_score: float
    student_skills: List[str]
    student_name: str

class CandidateMatchResponse(BaseModel):
    application_id: str
    student_email: str
    student_name: str
    student_skills: List[str]
    cover_letter: str
    resume_url: str
    portfolio_url: str
    github_url: str
    motivation: str
    relevant_experience: str
    applied_date: str
    status: str
    match_score: float
    internship_required_skills: List[str]
    internship_preferred_skills: List[str]
    academic_year: str
    department: str

@router.get("/student/matches/{student_email}", response_model=List[SkillMatchResponse])
async def get_student_skill_matches(student_email: str):
    """
    Get internships ranked by skill matching score for a student.
    Takes student email and returns all internships sorted by highest match score.
    """
    try:
        # Verify student exists
        student = users_collection.find_one({"email": student_email, "role": "student"})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        matches = SkillMatchingService.get_student_skill_matches(student_email)
        
        return matches
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching skill matches: {str(e)}")

@router.get("/hr/internship-matches/{internship_id}", response_model=List[CandidateMatchResponse])
async def get_internship_candidate_matches(internship_id: str):
    """
    Get candidates ranked by skill matching score for an internship.
    Takes internship id and returns all applicants sorted by highest match score.
    """
    try:
        matches = SkillMatchingService.get_internship_candidate_matches(internship_id)
        
        return matches
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching candidate matches: {str(e)}")
