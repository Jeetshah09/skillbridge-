#!/usr/bin/env python3
"""
Simple script to run the database seeding
"""

import subprocess
import sys
import os

def main():
    print("🌱 Running database seeding script...")
    
    try:
        # Run the seeding script
        result = subprocess.run([sys.executable, "seed_data.py"], 
                              cwd=os.path.dirname(os.path.abspath(__file__)),
                              capture_output=True, 
                              text=True)
        
        if result.returncode == 0:
            print(result.stdout)
            print("✅ Seeding completed successfully!")
        else:
            print("❌ Seeding failed!")
            print("Error:", result.stderr)
            
    except Exception as e:
        print(f"❌ Error running seeding script: {e}")

if __name__ == "__main__":
    main()

