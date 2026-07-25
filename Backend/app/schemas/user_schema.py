from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterStudentSchema(BaseModel):
    first_name: str
    last_name: str
    role: str = "student"
    email: EmailStr
    academic_year: str
    department: str
    password: str

class RegisterHRSchema(BaseModel):
    first_name: str
    last_name: str
    role: str = "hr"
    email: EmailStr
    company_name: str
    password: str

class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequestSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str
