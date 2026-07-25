#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import users_collection
from app.utils.auth_utils import hash_password

def create_hr_account():
    """Create HR account for jeet@techsolver.in"""
    print("👤 Creating HR Account")
    print("=" * 30)
    
    email = "jeet@techsolver.in"
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        print(f"❌ User with email {email} already exists!")
        print("   You should use the password reset flow instead.")
        return
    
    # Create HR user
    hr_user = {
        "first_name": "Jeet",
        "last_name": "TechSolver",
        "email": email,
        "password": hash_password("temp123"),  # Temporary password
        "role": "hr",
        "company_name": "TechSolver",
        "profile_pic": None
    }
    
    try:
        result = users_collection.insert_one(hr_user)
        print(f"✅ HR account created successfully!")
        print(f"   Email: {email}")
        print(f"   Role: HR")
        print(f"   Company: TechSolver")
        print(f"   Temporary Password: temp123")
        print(f"   User ID: {result.inserted_id}")
        print("\n📝 Next Steps:")
        print("1. Use the forgot password flow to set your permanent password")
        print("2. Call POST /auth/forgot-password with your email")
        print("3. Use the returned token to reset your password")
        
    except Exception as e:
        print(f"❌ Error creating account: {e}")

if __name__ == "__main__":
    create_hr_account()
