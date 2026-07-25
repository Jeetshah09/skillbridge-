#!/usr/bin/env python3

import requests
import json

def test_password_reset():
    """Test password reset functionality"""
    email = "jeet@techsolver.in"
    base_url = "http://127.0.0.1:8000"
    
    print("🔐 Testing Password Reset Flow")
    print("=" * 40)
    
    # Step 1: Test forgot password endpoint
    print(f"1. Testing forgot password for: {email}")
    forgot_url = f"{base_url}/auth/forgot-password"
    
    try:
        response = requests.post(
            forgot_url,
            json={"email": email},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data:
                token = data["token"]
                print(f"   ✅ Token generated: {token[:20]}...")
                
                # Step 2: Test reset password with the token
                print(f"\n2. Testing reset password with token")
                reset_url = f"{base_url}/auth/reset-password"
                
                reset_response = requests.post(
                    reset_url,
                    json={
                        "token": token,
                        "new_password": "newpassword123"
                    },
                    headers={"Content-Type": "application/json"}
                )
                
                print(f"   Status Code: {reset_response.status_code}")
                print(f"   Response: {reset_response.json()}")
                
                if reset_response.status_code == 200:
                    print("   ✅ Password reset successful!")
                else:
                    print("   ❌ Password reset failed")
            else:
                print("   ✅ Response indicates no account exists (correct behavior)")
        else:
            print("   ❌ Forgot password failed")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 40)
    print("📝 Notes:")
    print("- The forgot password endpoint ALWAYS returns success to avoid user enumeration")
    print("- If the email doesn't exist, it returns a generic message")
    print("- If the email exists, it generates a token and returns it")
    print("- The 'email already exists' error comes from the REGISTRATION endpoint")
    print("- Make sure you're calling /auth/forgot-password, not /auth/register/hr")

if __name__ == "__main__":
    test_password_reset()
