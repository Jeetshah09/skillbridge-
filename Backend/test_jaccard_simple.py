#!/usr/bin/env python3

from app.services.skill_matching_service import SkillMatchingService

def test_jaccard_similarity():
    """Test Jaccard similarity calculation"""
    print("🧪 Testing Jaccard Similarity Algorithm...")
    print("=" * 50)
    
    # Test 1: Perfect match
    student_skills = ["JavaScript", "React", "Node.js"]
    internship_skills = ["JavaScript", "React", "Node.js"]
    
    similarity = SkillMatchingService.calculate_jaccard_similarity(student_skills, internship_skills)
    print(f"Perfect match test:")
    print(f"  Student skills: {student_skills}")
    print(f"  Internship skills: {internship_skills}")
    print(f"  Similarity: {similarity}% (expected: 100.0%)")
    print(f"  ✅ {'PASS' if similarity == 100.0 else 'FAIL'}")
    print()
    
    # Test 2: No match
    student_skills = ["JavaScript", "React", "Node.js"]
    internship_skills = ["Python", "Django", "PostgreSQL"]
    
    similarity = SkillMatchingService.calculate_jaccard_similarity(student_skills, internship_skills)
    print(f"No match test:")
    print(f"  Student skills: {student_skills}")
    print(f"  Internship skills: {internship_skills}")
    print(f"  Similarity: {similarity}% (expected: 0.0%)")
    print(f"  ✅ {'PASS' if similarity == 0.0 else 'FAIL'}")
    print()
    
    # Test 3: Partial match
    student_skills = ["JavaScript", "React", "Node.js", "MongoDB"]
    internship_skills = ["JavaScript", "React", "Python", "Django"]
    
    similarity = SkillMatchingService.calculate_jaccard_similarity(student_skills, internship_skills)
    print(f"Partial match test:")
    print(f"  Student skills: {student_skills}")
    print(f"  Internship skills: {internship_skills}")
    print(f"  Similarity: {similarity}% (expected: 50.0%)")
    print(f"  ✅ {'PASS' if abs(similarity - 50.0) < 0.01 else 'FAIL'}")
    print()
    
    # Test 4: Case insensitive
    student_skills = ["JavaScript", "React", "NODE.js"]
    internship_skills = ["javascript", "react", "node.js"]
    
    similarity = SkillMatchingService.calculate_jaccard_similarity(student_skills, internship_skills)
    print(f"Case insensitive test:")
    print(f"  Student skills: {student_skills}")
    print(f"  Internship skills: {internship_skills}")
    print(f"  Similarity: {similarity}% (expected: 100.0%)")
    print(f"  ✅ {'PASS' if similarity == 100.0 else 'FAIL'}")
    print()
    
    print("=" * 50)
    print("🎉 Jaccard Similarity Algorithm Test Complete!")

if __name__ == "__main__":
    test_jaccard_similarity()
