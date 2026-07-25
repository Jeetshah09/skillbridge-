#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import applications_collection, internships_collection
from bson.objectid import ObjectId

def debug_applications():
    """Debug applications and internships"""
    internship_id = '69aefcfd2c39565d0d4d559e'
    
    # Check if application exists
    applications = list(applications_collection.find({'internship_id': internship_id}))
    print(f'Found {len(applications)} applications for internship {internship_id}')
    
    for app in applications:
        student_email = app.get('student_email', 'Unknown')
        status = app.get('status', 'Unknown')
        print(f'Application: {student_email} - {status}')
    
    # Check internship details
    internship = internships_collection.find_one({'_id': ObjectId(internship_id)})
    if internship:
        title = internship.get('title', 'Unknown')
        req_skills = internship.get('required_skills', [])
        pref_skills = internship.get('preferred_skills', [])
        print(f'Internship: {title}')
        print(f'Required skills: {req_skills}')
        print(f'Preferred skills: {pref_skills}')
    
    # Check all applications
    all_apps = list(applications_collection.find({}))
    print(f'\nTotal applications in database: {len(all_apps)}')
    for app in all_apps:
        print(f'  - {app.get("student_email", "Unknown")} -> {app.get("internship_id", "Unknown")}')

if __name__ == "__main__":
    debug_applications()
