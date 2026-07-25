#!/usr/bin/env python3

import requests

def test_hr_internships():
    """Test HR internships endpoint"""
    print("🧪 Testing HR Internships Endpoint")
    print("=" * 40)
    
    # Login as HR
    login_response = requests.post(
        'http://127.0.0.1:8000/auth/login',
        json={'email': 'jeet@techsolver.in', 'password': '123456'},
        headers={'Content-Type': 'application/json'}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return
    
    token = login_response.json()['access_token']
    print("✅ Login successful!")
    
    # Test the new /internships/my endpoint
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    my_internships_response = requests.get('http://127.0.0.1:8000/internships/my', headers=headers)
    
    print(f"My Internships Status: {my_internships_response.status_code}")
    
    if my_internships_response.status_code == 200:
        internships = my_internships_response.json()
        print(f"✅ Found {len(internships)} internships")
        for internship in internships:
            title = internship.get("title", "Unknown")
            company = internship.get("company_name", "Unknown")
            internship_id = internship.get("id", "N/A")
            print(f"  - {title} at {company} (ID: {internship_id})")
    else:
        print(f"❌ Error: {my_internships_response.text}")
    
    print("\n" + "=" * 40)
    print("🎯 Test Complete!")

if __name__ == "__main__":
    test_hr_internships()
