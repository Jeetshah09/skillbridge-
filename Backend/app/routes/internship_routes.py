from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import JWT_SECRET, JWT_ALGORITHM
from app.schemas.internship_schema import (
    CreateInternshipSchema, UpdateInternshipSchema, ApplyInternshipSchema, 
    UpdateApplicationSchema, InternshipResponseSchema, ApplicationResponseSchema
)
from app.database import internships_collection, applications_collection, users_collection
from app.models.internship_model import Internship, Application
from datetime import datetime
from typing import List, Optional
from bson import ObjectId

router = APIRouter(prefix="/internships", tags=["Internships"])
security = HTTPBearer()

# Dependency to get current user from JWT token
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = users_collection.find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# -------------------------------
# Internship CRUD Operations
# -------------------------------

@router.post("/", response_model=dict)
async def create_internship(internship: CreateInternshipSchema, current_user: dict = Depends(get_current_user)):
    """Create a new internship (HR/Admin only)"""
    if current_user["role"] not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR and Admin can create internships")
    
    # Prepare internship data
    internship_dict = internship.dict()
    internship_dict["mentor_email"] = current_user["email"]
    internship_dict["current_applicants"] = 0
    internship_dict["posted_date"] = datetime.utcnow()
    internship_dict["status"] = "active"
    
    # Insert into database
    result = internships_collection.insert_one(internship_dict)
    
    return {"message": "Internship created successfully", "internship_id": str(result.inserted_id)}

@router.get("/my", response_model=List[InternshipResponseSchema])
async def get_my_internships(current_user: dict = Depends(get_current_user)):
    """Get internships posted by the current HR user"""
    
    if current_user["role"] not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR and Admin can view their internships")
    
    # Get internships posted by this HR user
    if current_user["role"] == "hr":
        internships = internships_collection.find({"mentor_email": current_user["email"]})
    else:
        # Admin can see all internships
        internships = internships_collection.find()
    
    internship_list = []
    for internship in internships:
        internship["id"] = str(internship["_id"])
        internship_list.append(InternshipResponseSchema(**internship))
    
    return internship_list

@router.get("/", response_model=List[InternshipResponseSchema])
async def get_internships(
    status: Optional[str] = Query("active", description="Filter by status"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    work_type: Optional[str] = Query(None, description="Filter by work type"),
    search: Optional[str] = Query(None, description="Search in title, description, company"),
    limit: int = Query(20, description="Number of internships to return"),
    skip: int = Query(0, description="Number of internships to skip")
):
    """Get all internships with optional filtering"""
    
    # Build filter query
    filter_query = {}
    if status:
        filter_query["status"] = status
    if difficulty:
        filter_query["difficulty_level"] = difficulty
    if work_type:
        filter_query["work_type"] = work_type
    if search:
        filter_query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"company_name": {"$regex": search, "$options": "i"}},
            {"required_skills": {"$in": [{"$regex": search, "$options": "i"}]}}
        ]
    
    # Get internships
    cursor = internships_collection.find(filter_query).skip(skip).limit(limit).sort("posted_date", -1)
    internships = []
    
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        internships.append(InternshipResponseSchema(**doc))
    
    return internships

@router.get("/{internship_id}", response_model=InternshipResponseSchema)
async def get_internship(internship_id: str):
    """Get a specific internship by ID"""
    
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    internship = internships_collection.find_one({"_id": ObjectId(internship_id)})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship["id"] = str(internship["_id"])
    return InternshipResponseSchema(**internship)

@router.put("/{internship_id}", response_model=dict)
async def update_internship(
    internship_id: str, 
    update_data: UpdateInternshipSchema, 
    current_user: dict = Depends(get_current_user)
):
    """Update an internship (HR/Admin only)"""
    
    if current_user["role"] not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR and Admin can update internships")
    
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    # Check if internship exists and user owns it
    internship = internships_collection.find_one({"_id": ObjectId(internship_id)})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    if internship["mentor_email"] != current_user["email"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You can only update your own internships")
    
    # Update internship
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    if update_dict:
        internships_collection.update_one(
            {"_id": ObjectId(internship_id)}, 
            {"$set": update_dict}
        )
    
    return {"message": "Internship updated successfully"}

@router.delete("/{internship_id}", response_model=dict)
async def delete_internship(internship_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an internship (HR/Admin only)"""
    
    if current_user["role"] not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR and Admin can delete internships")
    
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    # Check if internship exists and user owns it
    internship = internships_collection.find_one({"_id": ObjectId(internship_id)})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    if internship["mentor_email"] != current_user["email"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You can only delete your own internships")
    
    # Delete internship and related applications
    internships_collection.delete_one({"_id": ObjectId(internship_id)})
    applications_collection.delete_many({"internship_id": internship_id})
    
    return {"message": "Internship deleted successfully"}

# -------------------------------
# Application Operations
# -------------------------------

@router.post("/{internship_id}/apply", response_model=dict)
async def apply_internship(
    internship_id: str, 
    application_data: ApplyInternshipSchema, 
    current_user: dict = Depends(get_current_user)
):
    """Apply for an internship (Students only)"""
    
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can apply for internships")
    
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    # Check if internship exists and is active
    internship = internships_collection.find_one({"_id": ObjectId(internship_id)})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    if internship["status"] != "active":
        raise HTTPException(status_code=400, detail="This internship is not accepting applications")
    
    if datetime.utcnow() > internship["application_deadline"]:
        raise HTTPException(status_code=400, detail="Application deadline has passed")
    
    if internship["current_applicants"] >= internship["max_applicants"]:
        raise HTTPException(status_code=400, detail="Maximum applications reached")
    
    # Check if user already applied
    existing_application = applications_collection.find_one({
        "internship_id": internship_id,
        "student_email": current_user["email"]
    })
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this internship")
    
    # Create application
    application_dict = application_data.dict()
    application_dict.update({
        "internship_id": internship_id,
        "student_email": current_user["email"],
        "student_name": f"{current_user['first_name']} {current_user['last_name']}",
        "status": "pending",
        "applied_date": datetime.utcnow()
    })
    
    result = applications_collection.insert_one(application_dict)
    
    # Update internship applicant count
    internships_collection.update_one(
        {"_id": ObjectId(internship_id)},
        {"$inc": {"current_applicants": 1}}
    )
    
    return {"message": "Application submitted successfully", "application_id": str(result.inserted_id)}

@router.get("/applications/my", response_model=List[ApplicationResponseSchema])
async def get_my_applications(current_user: dict = Depends(get_current_user)):
    """Get current user's applications"""
    
    if current_user["role"] == "student":
        # Get student's applications
        applications = applications_collection.find({"student_email": current_user["email"]})
    else:
        # Get applications for HR's internships
        my_internships = internships_collection.find({"mentor_email": current_user["email"]})
        internship_ids = [str(internship["_id"]) for internship in my_internships]
        
        if not internship_ids:
            return []
        
        applications = applications_collection.find({"internship_id": {"$in": internship_ids}})
    
    result = []
    for app in applications:
        app["id"] = str(app["_id"])
        
        # Get internship title for students
        if current_user["role"] == "student":
            internship = internships_collection.find_one({"_id": ObjectId(app["internship_id"])})
            app["internship_title"] = internship["title"] if internship else "Unknown"
        
        result.append(ApplicationResponseSchema(**app))
    
    return result

@router.put("/applications/{application_id}", response_model=dict)
async def update_application(
    application_id: str, 
    update_data: UpdateApplicationSchema, 
    current_user: dict = Depends(get_current_user)
):
    """Update application status (HR/Admin only)"""
    
    if current_user["role"] not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR and Admin can update applications")
    
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status_code=400, detail="Invalid application ID")
    
    # Get application and check if user owns the internship
    application = applications_collection.find_one({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    internship = internships_collection.find_one({"_id": ObjectId(application["internship_id"])})
    if not internship:
        raise HTTPException(status_code=404, detail="Associated internship not found")
    
    if internship["mentor_email"] != current_user["email"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You can only update applications for your internships")
    
    # Update application
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["reviewed_by"] = current_user["email"]
    update_dict["reviewed_date"] = datetime.utcnow()
    
    applications_collection.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": update_dict}
    )
    
    return {"message": "Application updated successfully"}

@router.get("/{internship_id}/applications", response_model=List[ApplicationResponseSchema])
async def get_internship_applications(internship_id: str, current_user: dict = Depends(get_current_user)):
    """Get applications for a specific internship (HR/Admin only)"""
    
    if current_user["role"] not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Only HR and Admin can view applications")
    
    if not ObjectId.is_valid(internship_id):
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    # Check if internship exists and user owns it
    internship = internships_collection.find_one({"_id": ObjectId(internship_id)})
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    if internship["mentor_email"] != current_user["email"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You can only view applications for your internships")
    
    # Get applications
    applications = applications_collection.find({"internship_id": internship_id})
    result = []
    
    for app in applications:
        app["id"] = str(app["_id"])
        result.append(ApplicationResponseSchema(**app))
    
    return result
