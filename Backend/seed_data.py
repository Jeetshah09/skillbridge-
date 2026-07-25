"""
MongoDB Seeding Script for SkillBridge Internship Platform
Run this script to populate your database with mock data for testing
"""

import os
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["smart_internship_db"]

# Collections
users_collection = db["users"]
internships_collection = db["internships"]
applications_collection = db["applications"]

def clear_database():
    """Clear existing data"""
    print("Clearing existing data...")
    users_collection.delete_many({})
    internships_collection.delete_many({})
    applications_collection.delete_many({})
    print("✅ Database cleared")

def create_users():
    """Create mock users"""
    print("Creating users...")
    
    users = [
        # Students
        {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@student.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "student",
            "academic_year": "3rd Year",
            "department": "Computer Science & Engineering",
            "profile_pic": None,
            "skills": ["JavaScript", "React", "Node.js", "MongoDB", "HTML", "CSS", "Python"]
        },
        {
            "first_name": "Alice",
            "last_name": "Johnson",
            "email": "alice@student.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "student",
            "academic_year": "2nd Year",
            "department": "Information Technology",
            "profile_pic": None,
            "skills": ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "SQL", "Statistics"]
        },
        {
            "first_name": "Bob",
            "last_name": "Smith",
            "email": "bob@student.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "student",
            "academic_year": "4th Year",
            "department": "Computer Science & Engineering",
            "profile_pic": None,
            "skills": ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript", "Redux", "Docker", "Git"]
        },
        {
            "first_name": "Emma",
            "last_name": "Wilson",
            "email": "emma@student.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "student",
            "academic_year": "1st Year",
            "department": "Electronics & Communication",
            "profile_pic": None,
            "skills": ["Figma", "Design Thinking", "User Research", "Adobe XD", "Sketch", "Prototyping"]
        },
        
        # HR Users
        {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@company.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "hr",
            "company_name": "Tech Solutions Inc",
            "profile_pic": None
        },
        {
            "first_name": "Michael",
            "last_name": "Brown",
            "email": "michael@mobiletech.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "hr",
            "company_name": "MobileTech Solutions",
            "profile_pic": None
        },
        {
            "first_name": "Sarah",
            "last_name": "Davis",
            "email": "sarah@datacorp.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "hr",
            "company_name": "DataCorp Analytics",
            "profile_pic": None
        },
        {
            "first_name": "David",
            "last_name": "Lee",
            "email": "david@creativestudio.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "hr",
            "company_name": "Creative Design Studio",
            "profile_pic": None
        },
        
        # Admin
        {
            "first_name": "Admin",
            "last_name": "User",
            "email": "admin@skillbridge.com",
            "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2/5xQqX1T2",  # "123456"
            "role": "admin",
            "profile_pic": None
        }
    ]
    
    result = users_collection.insert_many(users)
    print(f"✅ Created {len(result.inserted_ids)} users")
    return users

def create_internships():
    """Create mock internships"""
    print("Creating internships...")
    
    internships = [
        {
            "title": "Full-Stack Web Development Internship",
            "description": "Join our team to build modern web applications using React, Node.js, and MongoDB. You'll work on real projects and learn industry best practices.",
            "company_name": "Tech Solutions Inc",
            "mentor_email": "jane@company.com",
            "mentor_name": "Jane Smith",
            "mentor_year": "Graduate",
            "mentor_department": "Computer Science",
            "duration_weeks": 8,
            "stipend": 15000,
            "max_applicants": 5,
            "current_applicants": 3,
            "required_skills": ["JavaScript", "React", "Node.js", "MongoDB"],
            "preferred_skills": ["TypeScript", "Git", "Docker"],
            "difficulty_level": "intermediate",
            "work_type": "hybrid",
            "location": "Bangalore, India",
            "posted_date": datetime.utcnow() - timedelta(days=5),
            "application_deadline": datetime.utcnow() + timedelta(days=15),
            "start_date": datetime.utcnow() + timedelta(days=20),
            "end_date": datetime.utcnow() + timedelta(days=76),
            "status": "active",
            "additional_info": "This internship offers hands-on experience with modern web technologies and mentorship from senior developers.",
            "benefits": ["Certificate of completion", "Letter of recommendation", "Networking opportunities", "Potential job offer"]
        },
        {
            "title": "React Native Mobile App Development",
            "description": "Build a cross-platform mobile application using React Native. Learn about mobile development best practices, state management, and app deployment.",
            "company_name": "MobileTech Solutions",
            "mentor_email": "michael@mobiletech.com",
            "mentor_name": "Michael Brown",
            "mentor_year": "4th Year",
            "mentor_department": "Computer Science & Engineering",
            "duration_weeks": 6,
            "stipend": 12000,
            "max_applicants": 3,
            "current_applicants": 2,
            "required_skills": ["JavaScript", "React", "Mobile Development"],
            "preferred_skills": ["React Native", "Redux", "Firebase"],
            "difficulty_level": "intermediate",
            "work_type": "remote",
            "location": "Remote",
            "posted_date": datetime.utcnow() - timedelta(days=3),
            "application_deadline": datetime.utcnow() + timedelta(days=12),
            "start_date": datetime.utcnow() + timedelta(days=17),
            "end_date": datetime.utcnow() + timedelta(days=59),
            "status": "active",
            "additional_info": "Perfect opportunity to learn mobile app development with hands-on experience.",
            "benefits": ["Mobile development skills", "Portfolio project", "Mentorship"]
        },
        {
            "title": "Data Analysis & Machine Learning Internship",
            "description": "Work on real-world data analysis projects using Python, Pandas, and Scikit-learn. Learn about machine learning algorithms and data visualization.",
            "company_name": "DataCorp Analytics",
            "mentor_email": "sarah@datacorp.com",
            "mentor_name": "Dr. Sarah Wilson",
            "mentor_year": "Graduate",
            "mentor_department": "Data Science",
            "duration_weeks": 10,
            "stipend": 18000,
            "max_applicants": 4,
            "current_applicants": 1,
            "required_skills": ["Python", "Pandas", "NumPy", "Statistics"],
            "preferred_skills": ["Scikit-learn", "Matplotlib", "SQL"],
            "difficulty_level": "intermediate",
            "work_type": "hybrid",
            "location": "Mumbai, India",
            "posted_date": datetime.utcnow() - timedelta(days=7),
            "application_deadline": datetime.utcnow() + timedelta(days=8),
            "start_date": datetime.utcnow() + timedelta(days=12),
            "end_date": datetime.utcnow() + timedelta(days=82),
            "status": "active",
            "additional_info": "Ideal for students interested in data science and machine learning careers.",
            "benefits": ["Data science experience", "ML project portfolio", "Industry insights"]
        },
        {
            "title": "UI/UX Design Internship",
            "description": "Design user interfaces and user experiences for web and mobile applications. Learn about design principles, prototyping, and user research.",
            "company_name": "Creative Design Studio",
            "mentor_email": "david@creativestudio.com",
            "mentor_name": "David Lee",
            "mentor_year": "3rd Year",
            "mentor_department": "Design",
            "duration_weeks": 4,
            "stipend": 8000,
            "max_applicants": 6,
            "current_applicants": 4,
            "required_skills": ["Figma", "Design Thinking", "User Research"],
            "preferred_skills": ["Adobe XD", "Sketch", "Prototyping"],
            "difficulty_level": "beginner",
            "work_type": "onsite",
            "location": "Delhi, India",
            "posted_date": datetime.utcnow() - timedelta(days=2),
            "application_deadline": datetime.utcnow() + timedelta(days=18),
            "start_date": datetime.utcnow() + timedelta(days=25),
            "end_date": datetime.utcnow() + timedelta(days=53),
            "status": "active",
            "additional_info": "Great opportunity for creative students to learn professional design skills.",
            "benefits": ["Design portfolio", "Creative skills", "Industry exposure"]
        },
        {
            "title": "DevOps & Cloud Infrastructure Internship",
            "description": "Learn about cloud computing, containerization, and CI/CD pipelines. Work with AWS, Docker, and Kubernetes in a real-world environment.",
            "company_name": "CloudTech Systems",
            "mentor_email": "jane@company.com",
            "mentor_name": "Alex Rodriguez",
            "mentor_year": "Graduate",
            "mentor_department": "Computer Science",
            "duration_weeks": 12,
            "stipend": 20000,
            "max_applicants": 3,
            "current_applicants": 0,
            "required_skills": ["Linux", "Docker", "AWS Basics"],
            "preferred_skills": ["Kubernetes", "Terraform", "Jenkins"],
            "difficulty_level": "advanced",
            "work_type": "remote",
            "location": "Remote",
            "posted_date": datetime.utcnow() - timedelta(days=1),
            "application_deadline": datetime.utcnow() + timedelta(days=20),
            "start_date": datetime.utcnow() + timedelta(days=25),
            "end_date": datetime.utcnow() + timedelta(days=109),
            "status": "active",
            "additional_info": "Perfect for students interested in infrastructure and cloud technologies.",
            "benefits": ["Cloud certification", "DevOps experience", "High stipend"]
        },
        {
            "title": "Blockchain Development Internship",
            "description": "Build decentralized applications using Ethereum and Solidity. Learn about smart contracts, Web3, and blockchain technology.",
            "company_name": "BlockChain Innovations",
            "mentor_email": "michael@mobiletech.com",
            "mentor_name": "Priya Sharma",
            "mentor_year": "Graduate",
            "mentor_department": "Computer Science",
            "duration_weeks": 8,
            "stipend": 16000,
            "max_applicants": 2,
            "current_applicants": 1,
            "required_skills": ["JavaScript", "Solidity", "Blockchain Basics"],
            "preferred_skills": ["Web3.js", "Ethereum", "Smart Contracts"],
            "difficulty_level": "advanced",
            "work_type": "hybrid",
            "location": "Pune, India",
            "posted_date": datetime.utcnow() - timedelta(days=4),
            "application_deadline": datetime.utcnow() + timedelta(days=16),
            "start_date": datetime.utcnow() + timedelta(days=21),
            "end_date": datetime.utcnow() + timedelta(days=77),
            "status": "active",
            "additional_info": "Cutting-edge technology internship for blockchain enthusiasts.",
            "benefits": ["Blockchain expertise", "Smart contract skills", "Future-ready knowledge"]
        },
        {
            "title": "Python Backend Development",
            "description": "Develop RESTful APIs and backend services using Python, Django, and PostgreSQL. Learn about database design and API development.",
            "company_name": "Backend Solutions Ltd",
            "mentor_email": "sarah@datacorp.com",
            "mentor_name": "Raj Patel",
            "mentor_year": "4th Year",
            "mentor_department": "Computer Science & Engineering",
            "duration_weeks": 6,
            "stipend": 14000,
            "max_applicants": 4,
            "current_applicants": 2,
            "required_skills": ["Python", "Django", "PostgreSQL"],
            "preferred_skills": ["FastAPI", "Redis", "Docker"],
            "difficulty_level": "intermediate",
            "work_type": "remote",
            "location": "Remote",
            "posted_date": datetime.utcnow() - timedelta(days=6),
            "application_deadline": datetime.utcnow() + timedelta(days=9),
            "start_date": datetime.utcnow() + timedelta(days=14),
            "end_date": datetime.utcnow() + timedelta(days=56),
            "status": "closing_soon",
            "additional_info": "Great opportunity to learn backend development with Python.",
            "benefits": ["Backend skills", "API development", "Database knowledge"]
        },
        {
            "title": "Frontend Development with Vue.js",
            "description": "Build modern web applications using Vue.js, Vite, and modern CSS. Learn about component-based architecture and state management.",
            "company_name": "Frontend Masters",
            "mentor_email": "david@creativestudio.com",
            "mentor_name": "Lisa Wang",
            "mentor_year": "Graduate",
            "mentor_department": "Computer Science",
            "duration_weeks": 5,
            "stipend": 11000,
            "max_applicants": 5,
            "current_applicants": 3,
            "required_skills": ["JavaScript", "HTML", "CSS"],
            "preferred_skills": ["Vue.js", "Vite", "TypeScript"],
            "difficulty_level": "beginner",
            "work_type": "hybrid",
            "location": "Chennai, India",
            "posted_date": datetime.utcnow() - timedelta(days=8),
            "application_deadline": datetime.utcnow() + timedelta(days=7),
            "start_date": datetime.utcnow() + timedelta(days=12),
            "end_date": datetime.utcnow() + timedelta(days=47),
            "status": "closing_soon",
            "additional_info": "Perfect for beginners to learn modern frontend development.",
            "benefits": ["Vue.js expertise", "Modern CSS", "Component architecture"]
        }
    ]
    
    result = internships_collection.insert_many(internships)
    print(f"✅ Created {len(result.inserted_ids)} internships")
    return result.inserted_ids

def create_applications(internship_ids):
    """Create mock applications"""
    print("Creating applications...")
    
    applications = [
        {
            "internship_id": str(internship_ids[0]),  # Full-Stack Web Development
            "student_email": "john@student.com",
            "student_name": "John Doe",
            "cover_letter": "I am very interested in this full-stack development internship. I have experience with JavaScript, React, and Node.js from my coursework and personal projects. I'm eager to learn more about MongoDB and gain real-world experience in web development.",
            "resume_url": "https://drive.google.com/file/d/john-resume.pdf",
            "portfolio_url": "https://johndoe.dev",
            "github_url": "https://github.com/johndoe",
            "status": "pending",
            "applied_date": datetime.utcnow() - timedelta(days=2),
            "motivation": "I want to gain hands-on experience in full-stack development and learn industry best practices from experienced developers.",
            "relevant_experience": "I have built several web applications using React and Node.js, including a task management app and an e-commerce website."
        },
        {
            "internship_id": str(internship_ids[0]),  # Full-Stack Web Development
            "student_email": "alice@student.com",
            "student_name": "Alice Johnson",
            "cover_letter": "As a passionate developer, I'm excited about this opportunity to work on real-world projects. I have strong foundations in JavaScript and React, and I'm eager to expand my skills with backend technologies.",
            "resume_url": "https://drive.google.com/file/d/alice-resume.pdf",
            "portfolio_url": "https://alicejohnson.dev",
            "github_url": "https://github.com/alicejohnson",
            "status": "reviewed",
            "applied_date": datetime.utcnow() - timedelta(days=3),
            "reviewed_by": "jane@company.com",
            "reviewed_date": datetime.utcnow() - timedelta(days=1),
            "review_notes": "Strong technical skills and good portfolio. Good candidate.",
            "motivation": "I want to become a full-stack developer and this internship aligns perfectly with my career goals.",
            "relevant_experience": "Built a React-based social media dashboard and several Node.js APIs for university projects."
        },
        {
            "internship_id": str(internship_ids[0]),  # Full-Stack Web Development
            "student_email": "bob@student.com",
            "student_name": "Bob Smith",
            "cover_letter": "I'm a final year student with extensive experience in web development. I've worked with React, Node.js, and MongoDB in multiple projects and I'm ready to apply my skills in a professional environment.",
            "resume_url": "https://drive.google.com/file/d/bob-resume.pdf",
            "portfolio_url": "https://bobsmith.dev",
            "github_url": "https://github.com/bobsmith",
            "status": "selected",
            "applied_date": datetime.utcnow() - timedelta(days=4),
            "reviewed_by": "jane@company.com",
            "reviewed_date": datetime.utcnow() - timedelta(days=2),
            "review_notes": "Excellent candidate with strong technical skills and relevant experience. Highly recommended.",
            "motivation": "This internship will help me transition from academic projects to professional development.",
            "relevant_experience": "Developed a full-stack e-commerce platform with React, Node.js, and MongoDB for my final year project."
        },
        {
            "internship_id": str(internship_ids[1]),  # React Native
            "student_email": "john@student.com",
            "student_name": "John Doe",
            "cover_letter": "I'm interested in mobile app development and this React Native internship is perfect for me. I have experience with React and I'm eager to learn mobile development.",
            "resume_url": "https://drive.google.com/file/d/john-resume.pdf",
            "portfolio_url": "https://johndoe.dev",
            "github_url": "https://github.com/johndoe",
            "status": "pending",
            "applied_date": datetime.utcnow() - timedelta(days=1),
            "motivation": "I want to expand my skills from web development to mobile app development.",
            "relevant_experience": "Built responsive web applications using React and have basic knowledge of mobile development concepts."
        },
        {
            "internship_id": str(internship_ids[1]),  # React Native
            "student_email": "emma@student.com",
            "student_name": "Emma Wilson",
            "cover_letter": "As a first-year student, I'm excited to learn mobile development through this internship. I have strong programming fundamentals and I'm a quick learner.",
            "resume_url": "https://drive.google.com/file/d/emma-resume.pdf",
            "portfolio_url": "https://emmawilson.dev",
            "github_url": "https://github.com/emmawilson",
            "status": "reviewed",
            "applied_date": datetime.utcnow() - timedelta(days=2),
            "reviewed_by": "michael@mobiletech.com",
            "reviewed_date": datetime.utcnow() - timedelta(hours=12),
            "review_notes": "Good potential, needs guidance but shows enthusiasm.",
            "motivation": "I want to explore mobile development early in my academic career.",
            "relevant_experience": "Completed basic programming courses and built simple web applications."
        },
        {
            "internship_id": str(internship_ids[2]),  # Data Science
            "student_email": "alice@student.com",
            "student_name": "Alice Johnson",
            "cover_letter": "I'm passionate about data science and machine learning. This internship will help me apply my theoretical knowledge to real-world problems.",
            "resume_url": "https://drive.google.com/file/d/alice-resume.pdf",
            "portfolio_url": "https://alicejohnson.dev",
            "github_url": "https://github.com/alicejohnson",
            "status": "pending",
            "applied_date": datetime.utcnow() - timedelta(days=1),
            "motivation": "I want to build a career in data science and this internship provides the perfect foundation.",
            "relevant_experience": "Completed courses in statistics and Python programming. Built data visualization projects."
        },
        {
            "internship_id": str(internship_ids[3]),  # UI/UX Design
            "student_email": "emma@student.com",
            "student_name": "Emma Wilson",
            "cover_letter": "I have a creative background and I'm interested in learning UI/UX design. This internship will help me develop professional design skills.",
            "resume_url": "https://drive.google.com/file/d/emma-resume.pdf",
            "portfolio_url": "https://emmawilson.dev",
            "github_url": "https://github.com/emmawilson",
            "status": "selected",
            "applied_date": datetime.utcnow() - timedelta(days=1),
            "reviewed_by": "david@creativestudio.com",
            "reviewed_date": datetime.utcnow() - timedelta(hours=6),
            "review_notes": "Creative mindset and good design sense. Perfect fit for our team.",
            "motivation": "I want to combine my technical skills with design to create better user experiences.",
            "relevant_experience": "Created wireframes and mockups for university projects using Figma."
        },
        {
            "internship_id": str(internship_ids[3]),  # UI/UX Design
            "student_email": "bob@student.com",
            "student_name": "Bob Smith",
            "cover_letter": "I want to expand my skills beyond coding to include design. This UI/UX internship will help me become a more well-rounded developer.",
            "resume_url": "https://drive.google.com/file/d/bob-resume.pdf",
            "portfolio_url": "https://bobsmith.dev",
            "github_url": "https://github.com/bobsmith",
            "status": "rejected",
            "applied_date": datetime.utcnow() - timedelta(days=2),
            "reviewed_by": "david@creativestudio.com",
            "reviewed_date": datetime.utcnow() - timedelta(hours=3),
            "review_notes": "Strong technical background but lacks design experience. Not the right fit for this role.",
            "motivation": "I want to learn design principles to improve my development projects.",
            "relevant_experience": "Strong programming background with some basic design knowledge."
        }
    ]
    
    result = applications_collection.insert_many(applications)
    print(f"✅ Created {len(result.inserted_ids)} applications")
    
    # Update internship applicant counts
    for application in applications:
        internships_collection.update_one(
            {"_id": application["internship_id"]},
            {"$inc": {"current_applicants": 1}}
        )
    
    print("✅ Updated internship applicant counts")

def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    try:
        # Clear existing data
        clear_database()
        
        # Create users
        users = create_users()
        
        # Create internships
        internship_ids = create_internships()
        
        # Create applications
        create_applications(internship_ids)
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📊 Summary:")
        print(f"   👥 Users: {users_collection.count_documents({})}")
        print(f"   💼 Internships: {internships_collection.count_documents({})}")
        print(f"   📝 Applications: {applications_collection.count_documents({})}")
        
        print("\n🔑 Test Credentials:")
        print("   Student: john@student.com / 123456")
        print("   HR: jane@company.com / 123456")
        print("   Admin: admin@skillbridge.com / 123456")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
