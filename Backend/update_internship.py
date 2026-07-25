#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import internships_collection
from datetime import datetime, timedelta
from bson.objectid import ObjectId

def update_internship_deadline():
    """Update internship deadline to future date"""
    internship_id = '69aefcfd2c39565d0d4d559e'
    future_deadline = datetime.utcnow() + timedelta(days=30)
    
    result = internships_collection.update_one(
        {'_id': ObjectId(internship_id)},
        {'$set': {'application_deadline': future_deadline}}
    )
    
    print(f'Updated {result.modified_count} internship')
    print(f'New deadline: {future_deadline.isoformat()}')
    
    # Verify the update
    internship = internships_collection.find_one({'_id': ObjectId(internship_id)})
    if internship:
        print(f'Current deadline: {internship.get("application_deadline").isoformat()}')

if __name__ == "__main__":
    update_internship_deadline()
