#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.skill_matching_service import SkillMatchingService
from app.routes.skill_matching_routes import CandidateMatchResponse

def test_serialization():
    """Test Pydantic serialization"""
    internship_id = '69aefcfd2c39565d0d4d559e'
    
    print("🔍 Testing Pydantic Serialization")
    print("=" * 40)
    
    try:
        matches = SkillMatchingService.get_internship_candidate_matches(internship_id)
        print(f'Raw matches: {len(matches)}')
        
        # Try to serialize with Pydantic
        for match in matches:
            print(f'Match data keys: {list(match.keys())}')
            response = CandidateMatchResponse(**match)
            print(f'✅ Serialized: {response.student_name} - {response.match_score}%')
            
    except Exception as e:
        print(f'❌ Serialization error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_serialization()
