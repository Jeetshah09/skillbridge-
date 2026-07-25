#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.skill_matching_service import SkillMatchingService

def test_api_with_debug():
    """Test API with detailed debugging"""
    internship_id = '69aefcfd2c39565d0d4d559e'
    
    print("🔍 Testing API with Debug")
    print("=" * 30)
    
    try:
        matches = SkillMatchingService.get_internship_candidate_matches(internship_id)
        print(f"✅ Success: Found {len(matches)} candidates")
        
        for match in matches:
            print(f"  - {match.get('student_name', 'Unknown')}: {match.get('match_score', 0)}%")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_with_debug()
