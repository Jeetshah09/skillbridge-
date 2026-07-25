from pydantic import BaseModel
from typing import List, Optional


class SuggestRequestSchema(BaseModel):
    skills: List[str]
    preferred_work_type: Optional[str] = None  # remote, hybrid, onsite
    difficulty: Optional[str] = None  # beginner, intermediate, advanced
    limit: int = 10


class ScoredInternshipSchema(BaseModel):
    id: str
    title: str
    company_name: str
    match: int
    reason: str
    duration_weeks: int
    work_type: str
    difficulty_level: str
