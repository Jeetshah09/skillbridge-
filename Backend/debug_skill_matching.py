#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.skill_matching_service import SkillMatchingService

def debug_skill_matching():
    """Debug skill matching directly"""
    internship_id = '69aefcfd2c39565d0d4d559e'
    
    print("🔍 Debugging Skill Matching Service")
    print("=" * 40)
    
    try:
        # Call the skill matching service directly
        matches = SkillMatchingService.get_internship_candidate_matches(internship_id)
        
        print(f"Found {len(matches)} candidates")
        
        for match in matches:
            name = match.get('student_name', 'Unknown')
            score = match.get('match_score', 0)
            skills = match.get('student_skills', [])
            print(f"\n🎯 Candidate: {name}")
            print(f"   Match Score: {score}%")
            print(f"   Skills: {skills}")
            
            # Show Jaccard calculation
            req_skills = match.get('internship_required_skills', [])
            pref_skills = match.get('internship_preferred_skills', [])
            all_internship_skills = req_skills + pref_skills
            
            print(f"   Internship Required Skills: {req_skills}")
            print(f"   Internship Preferred Skills: {pref_skills}")
            print(f"   All Internship Skills: {all_internship_skills}")
            
            # Calculate Jaccard manually
            if skills and all_internship_skills:
                student_set = set(skill.lower() for skill in skills)
                internship_set = set(skill.lower() for skill in all_internship_skills)
                intersection = student_set.intersection(internship_set)
                union = student_set.union(internship_set)
                manual_score = len(intersection) / len(union) * 100 if union else 0
                
                print(f"   Manual Jaccard Score: {manual_score:.2f}%")
                print(f"   Intersection: {intersection}")
                print(f"   Union: {union}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_skill_matching()
