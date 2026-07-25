#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import users_collection
from app.utils.auth_utils import verify_password

def check_password():
    """Check current password for HR user"""
    email = "jeet@techsolver.in"
    
    user = users_collection.find_one({'email': email})
    
    if user:
        stored_hash = user.get("password", "")
        print(f'✅ User found:')
        print(f'  Email: {user.get("email", "")}')
        print(f'  Name: {user.get("first_name", "")} {user.get("last_name", "")}')
        print(f'  Stored hash: {stored_hash[:50]}...')
        
        # Test with different passwords
        test_passwords = ["temp123", "newpassword123", "123456"]
        
        for pwd in test_passwords:
            try:
                is_valid = verify_password(pwd, stored_hash)
                print(f'  Password "{pwd}": {"✅ Valid" if is_valid else "❌ Invalid"}')
            except Exception as e:
                print(f'  Password "{pwd}": ❌ Error - {e}')
    else:
        print('❌ User not found in database')

if __name__ == "__main__":
    check_password()
