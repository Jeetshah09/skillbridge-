#!/usr/bin/env python3

import requests

def test_full_skill_matching():
    """Test complete skill matching flow"""
    print("🧪 Testing Complete Skill Matching Flow")
    print("=" * 50)
    
    internship_id = '69aefcfd2c39565d0d4d559e'
    
    # Step 1: Login as student and apply
    print("1. Student applying to internship...")
    student_login = requests.post(
        'http://127.0.0.1:8000/auth/login',
        json={'email': 'john@student.com', 'password': '123456'},
        headers={'Content-Type': 'application/json'}
    )
    
    if student_login.status_code != 200:
        print(f"❌ Student login failed: {student_login.status_code}")
        return
    
    student_token = student_login.json()['access_token']
    student_headers = {'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'}
    
    # Apply to internship
    application_data = {
        'cover_letter': 'I am very interested in this AI internship. I have experience with Python, React, and machine learning.',
        'resume_url': 'https://example.com/resume.pdf',
        'github_url': 'https://github.com/johndoe',
        'motivation': 'I want to learn AI and contribute to real-world projects.',
        'relevant_experience': 'Built ML models for academic projects using Python and TensorFlow.'
    }
    
    apply_response = requests.post(
        f'http://127.0.0.1:8000/internships/{internship_id}/apply',
        json=application_data,
        headers=student_headers
    )
    
    print(f"   Application Status: {apply_response.status_code}")
    if apply_response.status_code == 200:
        print("   ✅ Application submitted successfully!")
    else:
        print(f"   ❌ Application failed: {apply_response.text}")
        return
    
    # Step 2: Login as HR and check skill matching
    print("\n2. HR checking skill matching...")
    hr_login = requests.post(
        'http://127.0.0.1:8000/auth/login',
        json={'email': 'jeet@techsolver.in', 'password': '123456'},
        headers={'Content-Type': 'application/json'}
    )
    
    if hr_login.status_code != 200:
        print(f"❌ HR login failed: {hr_login.status_code}")
        return
    
    hr_token = hr_login.json()['access_token']
    hr_headers = {'Authorization': f'Bearer {hr_token}'}
    
    # Get skill matching results
    skill_response = requests.get(
        f'http://127.0.0.1:8000/api/skill-matching/hr/internship-matches/{internship_id}',
        headers=hr_headers
    )
    
    print(f"   Skill Matching Status: {skill_response.status_code}")
    
    if skill_response.status_code == 200:
        candidates = skill_response.json()
        print(f"   ✅ Found {len(candidates)} candidates")
        
        for candidate in candidates:
            name = candidate.get('student_name', 'Unknown')
            score = candidate.get('match_score', 0)
            skills = candidate.get('student_skills', [])
            status = candidate.get('status', 'Unknown')
            
            print(f"\n   🎯 Candidate: {name}")
            print(f"      Match Score: {score}%")
            print(f"      Status: {status}")
            print(f"      Skills: {skills}")
            
            # Show required vs matched skills
            req_skills = candidate.get('internship_required_skills', [])
            pref_skills = candidate.get('internship_preferred_skills', [])
            print(f"      Required Skills: {req_skills}")
            print(f"      Preferred Skills: {pref_skills}")
    else:
        print(f"   ❌ Skill matching error: {skill_response.text}")
    
    print("\n" + "=" * 50)
    print("🎉 Skill Matching Test Complete!")

if __name__ == "__main__":
    test_full_skill_matching()
