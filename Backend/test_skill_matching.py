#!/usr/bin/env python3

"""
Test script for the Skill Matching System
This script tests the Jaccard similarity algorithm and API endpoints
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.skill_matching_service import SkillMatchingService

def test_jaccard_similarity():
    """Test the Jaccard similarity calculation"""
    print("Testing Jaccard Similarity Algorithm...")
    
    # Test case 1: Perfect match
    skills1 = ["python", "javascript", "react", "mongodb"]
    skills2 = ["python", "javascript", "react", "mongodb"]
    similarity = SkillMatchingService.calculate_jaccard_similarity(skills1, skills2)
    print(f"Perfect match: {similarity} (expected: 1.0)")
    assert similarity == 1.0, "Perfect match should be 1.0"
    
    # Test case 2: No match
    skills1 = ["python", "javascript"]
    skills2 = ["react", "mongodb"]
    similarity = SkillMatchingService.calculate_jaccard_similarity(skills1, skills2)
    print(f"No match: {similarity} (expected: 0.0)")
    assert similarity == 0.0, "No match should be 0.0"
    
    # Test case 3: Partial match
    skills1 = ["python", "javascript", "react", "mongodb", "nodejs"]
    skills2 = ["python", "react", "mongodb", "django"]
    similarity = SkillMatchingService.calculate_jaccard_similarity(skills1, skills2)
    print(f"Partial match: {similarity} (expected: 0.6)")
    assert similarity == 0.6, f"Partial match should be 0.6, got {similarity}"
    
    # Test case 4: Empty sets
    skills1 = []
    skills2 = []
    similarity = SkillMatchingService.calculate_jaccard_similarity(skills1, skills2)
    print(f"Empty sets: {similarity} (expected: 0.0)")
    assert similarity == 0.0, "Empty sets should be 0.0"
    
    # Test case 5: One empty set
    skills1 = ["python", "javascript"]
    skills2 = []
    similarity = SkillMatchingService.calculate_jaccard_similarity(skills1, skills2)
    print(f"One empty set: {similarity} (expected: 0.0)")
    assert similarity == 0.0, "One empty set should be 0.0"
    
    print("✅ Jaccard similarity tests passed!")

def test_matched_skills():
    """Test the matched skills functionality"""
    print("\nTesting Matched Skills...")
    
    student_skills = ["python", "javascript", "react", "mongodb", "nodejs"]
    internship_skills = ["python", "react", "mongodb", "django"]
    
    matched = SkillMatchingService.get_matched_skills(student_skills, internship_skills)
    expected = ["python", "react", "mongodb"]
    
    print(f"Student skills: {student_skills}")
    print(f"Internship skills: {internship_skills}")
    print(f"Matched skills: {matched}")
    print(f"Expected: {expected}")
    
    assert set(matched) == set(expected), f"Expected {expected}, got {matched}"
    print("✅ Matched skills test passed!")

def test_case_insensitive_matching():
    """Test that skill matching is case insensitive"""
    print("\nTesting Case Insensitive Matching...")
    
    skills1 = ["Python", "JavaScript", "React", "MongoDB"]
    skills2 = ["python", "javascript", "react", "mongodb"]
    
    similarity = SkillMatchingService.calculate_jaccard_similarity(skills1, skills2)
    print(f"Case insensitive match: {similarity} (expected: 1.0)")
    assert similarity == 1.0, "Case insensitive matching should be 1.0"
    
    # Test with extra spaces
    skills1 = ["python", "javascript ", " react", "mongodb"]
    skills2 = ["python", "javascript", "react", "mongodb"]
    
    similarity = SkillMatchingService.calculate_jaccard_similarity(skills1, skills2)
    print(f"Space handling match: {similarity} (expected: 1.0)")
    assert similarity == 1.0, "Space handling should result in 1.0"
    
    print("✅ Case insensitive matching tests passed!")

def main():
    """Run all tests"""
    print("🧪 Testing Skill Matching System")
    print("=" * 50)
    
    try:
        test_jaccard_similarity()
        test_matched_skills()
        test_case_insensitive_matching()
        
        print("\n" + "=" * 50)
        print("🎉 All tests passed! The skill matching system is working correctly.")
        print("\nKey Features Verified:")
        print("✅ Jaccard similarity algorithm (|intersection| / |union|)")
        print("✅ Case insensitive skill matching")
        print("✅ Whitespace handling in skill names")
        print("✅ Empty set handling")
        print("✅ Matched skills extraction")
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
