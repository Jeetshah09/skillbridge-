from typing import List, Dict, Any
from app.database import users_collection, internships_collection, applications_collection
from datetime import datetime
from bson.objectid import ObjectId

class SkillMatchingService:
    """Service for AI-based skill matching using Jaccard Similarity"""
    
    @staticmethod
    def calculate_jaccard_similarity(student_skills: List[str], internship_skills: List[str]) -> float:
        """
        Calculate Jaccard similarity between student skills and internship skills.
        Formula: |intersection| / |union|
        """
        if not student_skills or not internship_skills:
            return 0.0
        
        # Convert to lowercase for case-insensitive comparison
        student_skills_set = set(skill.lower() for skill in student_skills)
        internship_skills_set = set(skill.lower() for skill in internship_skills)
        
        # Calculate intersection and union
        intersection = student_skills_set.intersection(internship_skills_set)
        union = student_skills_set.union(internship_skills_set)
        
        # Calculate Jaccard similarity
        if not union:
            return 0.0
        
        similarity = len(intersection) / len(union)
        return round(similarity * 100, 2)  # Return as percentage
    
    @staticmethod
    def get_student_skill_matches(student_email: str) -> List[Dict[str, Any]]:
        """
        Get internships ranked by skill matching score for a student.
        """
        # Get student's skills
        student = users_collection.find_one({"email": student_email, "role": "student"})
        if not student:
            return []
        
        student_skills = student.get("skills", [])
        student_name = f"{student.get('first_name', '')} {student.get('last_name', '')}"
        
        # Get all active internships
        internships = list(internships_collection.find({
            "status": "active",
            "application_deadline": {"$gt": datetime.now()}
        }))
        
        matches = []
        for internship in internships:
            # Combine required and preferred skills for matching
            all_internship_skills = internship.get("required_skills", []) + internship.get("preferred_skills", [])
            
            # Calculate similarity score
            match_score = SkillMatchingService.calculate_jaccard_similarity(
                student_skills, all_internship_skills
            )
            
            # Only include internships with some skill match
            if match_score > 0:
                match_data = {
                    "internship_id": str(internship["_id"]),
                    "title": internship.get("title", ""),
                    "company_name": internship.get("company_name", ""),
                    "description": internship.get("description", ""),
                    "required_skills": internship.get("required_skills", []),
                    "preferred_skills": internship.get("preferred_skills", []),
                    "duration_weeks": internship.get("duration_weeks", 0),
                    "stipend": internship.get("stipend", 0),
                    "work_type": internship.get("work_type", ""),
                    "location": internship.get("location") or "",
                    "application_deadline": internship.get("application_deadline").isoformat() if internship.get("application_deadline") and hasattr(internship.get("application_deadline"), 'isoformat') else "",
                    "start_date": internship.get("start_date").isoformat() if internship.get("start_date") and hasattr(internship.get("start_date"), 'isoformat') else "",
                    "end_date": internship.get("end_date").isoformat() if internship.get("end_date") and hasattr(internship.get("end_date"), 'isoformat') else "",
                    "difficulty_level": internship.get("difficulty_level", ""),
                    "benefits": internship.get("benefits", []),
                    "match_score": match_score,
                    "student_skills": student_skills,
                    "student_name": student_name
                }
                matches.append(match_data)
        
        # Sort by highest match score
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matches
    
    @staticmethod
    def get_internship_candidate_matches(internship_id: str) -> List[Dict[str, Any]]:
        """
        Get candidates ranked by skill matching score for an internship.
        """
        # Get internship details
        try:
            internship = internships_collection.find_one({"_id": ObjectId(internship_id)})
        except:
            return []
            
        if not internship:
            return []
        
        # Get all applications for this internship
        applications = list(applications_collection.find({"internship_id": internship_id}))
        
        # Combine required and preferred skills for matching
        all_internship_skills = internship.get("required_skills", []) + internship.get("preferred_skills", [])
        
        matches = []
        for application in applications:
            # Get student details
            student_email = application.get("student_email")
            student = users_collection.find_one({"email": student_email, "role": "student"})
            
            if not student:
                continue
            
            student_skills = student.get("skills", [])
            student_name = f"{student.get('first_name', '')} {student.get('last_name', '')}"
            
            # Calculate similarity score
            match_score = SkillMatchingService.calculate_jaccard_similarity(
                student_skills, all_internship_skills
            )
            
            match_data = {
                "application_id": str(application["_id"]),
                "student_email": student_email,
                "student_name": student_name,
                "student_skills": student_skills,
                "cover_letter": application.get("cover_letter", "") or "",
                "resume_url": application.get("resume_url", "") or "",
                "portfolio_url": application.get("portfolio_url", "") or "",
                "github_url": application.get("github_url", "") or "",
                "motivation": application.get("motivation", "") or "",
                "relevant_experience": application.get("relevant_experience", "") or "",
                "applied_date": application.get("applied_date").isoformat() if application.get("applied_date") and hasattr(application.get("applied_date"), 'isoformat') else str(application.get("applied_date", "")),
                "status": application.get("status", "pending"),
                "match_score": match_score,
                "internship_required_skills": internship.get("required_skills", []),
                "internship_preferred_skills": internship.get("preferred_skills", []),
                "academic_year": student.get("academic_year", "") or "",
                "department": student.get("department", "") or ""
            }
            matches.append(match_data)
        
        # Sort by highest match score
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matches
