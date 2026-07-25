from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
import secrets
from app.schemas.user_schema import (
    RegisterStudentSchema,
    RegisterHRSchema,
    LoginUserSchema,
    ForgotPasswordRequestSchema,
    ResetPasswordSchema,
)
from app.database import users_collection, password_reset_tokens_collection
from app.utils.auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

# -------------------------------
# Register Student
# -------------------------------
@router.post("/register/student")
def register_student(student: RegisterStudentSchema):
    existing = users_collection.find_one({"email": student.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    student_dict = student.dict()
    student_dict["password"] = hash_password(student.password)
    users_collection.insert_one(student_dict)

    return {"message": "Student registered successfully!"}


# -------------------------------
# Register HR
# -------------------------------
@router.post("/register/hr")
def register_hr(hr: RegisterHRSchema):
    existing = users_collection.find_one({"email": hr.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hr_dict = hr.dict()
    hr_dict["password"] = hash_password(hr.password)
    users_collection.insert_one(hr_dict)

    return {"message": "HR registered successfully!"}


# -------------------------------
# Login (Common for all roles)
# -------------------------------
@router.post("/login")
def login_user(login_data: LoginUserSchema):
    user = users_collection.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user["email"], "role": user["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "first_name": user["first_name"],
        "last_name": user["last_name"]
    }


# -------------------------------
# Forgot Password
# -------------------------------
@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequestSchema):
    # Always return success to avoid user enumeration
    user = users_collection.find_one({"email": payload.email})
    if user:
        # Create token valid for 30 minutes
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(minutes=30)
        password_reset_tokens_collection.update_one(
            {"email": payload.email},
            {"$set": {"email": payload.email, "token": token, "expires_at": expires_at}},
            upsert=True,
        )
        # TODO: send email with reset link containing token
        return {"message": "Password reset token generated.", "token": token}
    return {"message": "If an account exists, a password reset link has been sent."}


# -------------------------------
# Reset Password
# -------------------------------
@router.post("/reset-password")
def reset_password(payload: ResetPasswordSchema):
    rec = password_reset_tokens_collection.find_one({"token": payload.token})
    if not rec:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    if rec.get("expires_at") and datetime.utcnow() > rec["expires_at"]:
        password_reset_tokens_collection.delete_one({"_id": rec.get("_id")})
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Update user password
    email = rec["email"]
    user = users_collection.find_one({"email": email})
    if not user:
        # Clean token and fail safely
        password_reset_tokens_collection.delete_one({"_id": rec.get("_id")})
        raise HTTPException(status_code=400, detail="Invalid token")

    users_collection.update_one({"email": email}, {"$set": {"password": hash_password(payload.new_password)}})
    password_reset_tokens_collection.delete_one({"_id": rec.get("_id")})
    return {"message": "Password has been reset successfully"}
