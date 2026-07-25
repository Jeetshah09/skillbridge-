#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import users_collection

def check_user():
    """Check if user exists in database"""
    email = "jeet@techsolver.in"
    
    user = users_collection.find_one({'email': email})
    
    if user:
        print('✅ User found:')
        print(f'  Name: {user.get("first_name", "")} {user.get("last_name", "")}')
        print(f'  Email: {user.get("email", "")}')
        print(f'  Role: {user.get("role", "")}')
        print(f'  Company: {user.get("company_name", "")}')
        print(f'  User ID: {str(user.get("_id", ""))}')
    else:
        print('❌ User not found in database')

if __name__ == "__main__":
    check_user()
