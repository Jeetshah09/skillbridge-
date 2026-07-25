#!/usr/bin/env python3

import requests
import json

def test_post_internship():
    """Test HR post internship functionality"""
    print("🧪 Testing HR Post Internship")
    print("=" * 40)
    
    # Login as HR user first
    login_response = requests.post(
        'http://127.0.0.1:8000/auth/login',
        json={'email': 'jeet@techsolver.in', 'password': 'newpassword123'},
        headers={'Content-Type': 'application/json'}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return
    
    token = login_response.json()['access_token']
    print("✅ Login successful!")
    
    # Test post internship
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    internship_data = {
        "title": "Test AI Internship",
        "description": "Join our AI team to work on cutting-edge machine learning projects.",
        "company_name": "TechSolver",
        "mentor_name": "Jeet Mentor",
        "mentor_year": "Graduate",
        "mentor_department": "Computer Science",
        "duration_weeks": 12,
        "stipend": 15000,
        "max_applicants": 5,
        "required_skills": ["Python", "Machine Learning", "TensorFlow"],
        "preferred_skills": ["Deep Learning", "PyTorch", "Data Science"],
        "difficulty_level": "intermediate",
        "work_type": "remote",
        "location": "Remote",
        "application_deadline": "2024-12-31T00:00:00",
        "start_date": "2024-01-15T00:00:00",
        "additional_info": "Great opportunity to learn AI/ML skills",
        "benefits": ["Flexible hours", "Remote work", "Learning opportunities"]
    }
    
    print(f"📝 Posting internship: {internship_data['title']}")
    
    post_response = requests.post(
        'http://127.0.0.1:8000/internships/',
        json=internship_data,
        headers=headers
    )
    
    print(f"Status Code: {post_response.status_code}")
    
    if post_response.status_code == 200:
        result = post_response.json()
        print("✅ Internship posted successfully!")
        print(f"   Internship ID: {result.get('internship_id', 'N/A')}")
        print(f"   Message: {result.get('message', 'No message')}")
    else:
        print("❌ Failed to post internship")
        print(f"   Error: {post_response.text}")
    
    print("\n" + "=" * 40)
    print("🎯 Test Complete!")

if __name__ == "__main__":
    test_post_internship()
