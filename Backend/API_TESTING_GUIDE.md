# SkillBridge API Testing Guide

This guide provides everything you need to test the SkillBridge internship API using Postman and populate your database with mock data.

## 📋 **Quick Start**

### 1. **Import Postman Collection**
- Open Postman
- Click "Import" → "Upload Files"
- Select `internship-api.postman_collection.json`
- The collection will be imported with all endpoints and test data

### 2. **Seed Database with Mock Data**
```bash
cd backend
python seed_data.py
```

### 3. **Start Your Backend**
```bash
cd backend
uvicorn app.main:app --reload
```

## 🔧 **Postman Collection Overview**

### **Authentication Endpoints**
- **Register Student**: Create student accounts
- **Register HR**: Create HR accounts  
- **Login (Student)**: Login as student (auto-saves token)
- **Login (HR)**: Login as HR (auto-saves token)

### **Internship Management**
- **Create Internship**: HR can post new internships
- **Get All Internships**: Browse with filtering options
- **Get Internship by ID**: View specific internship details
- **Update Internship**: Modify internship details
- **Delete Internship**: Remove internship posting

### **Application Management**
- **Apply for Internship**: Students can apply
- **Get My Applications**: View student's applications
- **Get Applications for Internship**: HR can view applications
- **Update Application Status**: HR can review and update status

### **Mock Data Setup**
- **Create Multiple Internships**: Pre-built internship examples
- **Create Data Science Internship**: Specialized internship data
- **Create UI/UX Design Internship**: Design-focused internship

## 🎯 **Testing Workflow**

### **Step 1: Authentication**
1. Run "Register Student" to create a test student
2. Run "Register HR" to create a test HR user
3. Run "Login (Student)" - token will be auto-saved
4. Run "Login (HR)" - token will be auto-saved

### **Step 2: Create Internships**
1. Use "Login (HR)" first to get HR token
2. Run "Create Internship" to post a new internship
3. Note the `internship_id` in the response
4. Run "Get All Internships" to see your posting

### **Step 3: Apply for Internships**
1. Use "Login (Student)" to get student token
2. Run "Apply for Internship" using the `internship_id`
3. Run "Get My Applications" to see the application

### **Step 4: Review Applications**
1. Use "Login (HR)" to get HR token
2. Run "Get Applications for Internship" to see applications
3. Run "Update Application Status" to review applications

## 📊 **Mock Data Overview**

### **Users Created**
- **Students**: 4 test students with different academic years
- **HR Users**: 4 HR users from different companies
- **Admin**: 1 admin user for system management

### **Internships Created**
- **Full-Stack Web Development** (Tech Solutions Inc)
- **React Native Mobile Development** (MobileTech Solutions)
- **Data Science & ML** (DataCorp Analytics)
- **UI/UX Design** (Creative Design Studio)
- **DevOps & Cloud** (CloudTech Systems)
- **Blockchain Development** (BlockChain Innovations)
- **Python Backend** (Backend Solutions Ltd)
- **Vue.js Frontend** (Frontend Masters)

### **Applications Created**
- Multiple applications with different statuses
- Realistic cover letters and portfolio links
- Proper application tracking with review notes

## 🔑 **Test Credentials**

### **Students**
```
john@student.com / 123456
alice@student.com / 123456
bob@student.com / 123456
emma@student.com / 123456
```

### **HR Users**
```
jane@company.com / hrpassword
michael@mobiletech.com / hrpassword
sarah@datacorp.com / hrpassword
david@creativestudio.com / hrpassword
```

### **Admin**
```
admin@skillbridge.com / admin123
```

## 🚀 **API Features**

### **Authentication**
- JWT-based authentication
- Automatic token management in Postman
- Role-based access control

### **Filtering & Search**
- Filter by difficulty, work type, status
- Search by title, description, company, skills
- Pagination support

### **Application Tracking**
- Status updates (pending, reviewed, selected, rejected)
- Review notes and feedback
- Application history tracking

### **Data Validation**
- Comprehensive input validation
- Error handling with descriptive messages
- Type safety with Pydantic models

## 📝 **Sample API Calls**

### **Create Internship (HR)**
```json
{
    "title": "Full-Stack Web Development Internship",
    "description": "Build modern web applications using React, Node.js, and MongoDB",
    "company_name": "Tech Solutions Inc",
    "mentor_name": "Jane Smith",
    "duration_weeks": 8,
    "stipend": 15000,
    "max_applicants": 5,
    "required_skills": ["JavaScript", "React", "Node.js"],
    "difficulty_level": "intermediate",
    "work_type": "hybrid",
    "application_deadline": "2024-02-15T23:59:59"
}
```

### **Apply for Internship (Student)**
```json
{
    "cover_letter": "I am very interested in this internship...",
    "resume_url": "https://drive.google.com/file/d/resume.pdf",
    "portfolio_url": "https://myportfolio.com",
    "github_url": "https://github.com/myusername",
    "motivation": "I want to gain real-world experience...",
    "relevant_experience": "I have built several web applications..."
}
```

### **Update Application Status (HR)**
```json
{
    "status": "selected",
    "review_notes": "Excellent candidate with strong technical skills."
}
```

## 🔍 **Testing Scenarios**

### **Student Journey**
1. Register → Login → Browse Internships → Apply → Track Applications

### **HR Journey**
1. Register → Login → Post Internship → Review Applications → Update Status

### **Admin Journey**
1. Login → Manage All Internships → View All Applications → System Management

## 🛠️ **Troubleshooting**

### **Common Issues**
- **401 Unauthorized**: Check if token is set correctly
- **403 Forbidden**: Ensure you're using the right role (student/HR)
- **400 Bad Request**: Check request body format and required fields
- **404 Not Found**: Verify the internship/application ID exists

### **Token Management**
- Tokens are automatically saved in Postman variables
- Use "Login" requests to refresh tokens
- Check Authorization header in requests

### **Database Issues**
- Run `python seed_data.py` to reset data
- Check MongoDB connection in `.env` file
- Verify database name is `smart_internship_db`

## 📈 **Performance Testing**

### **Load Testing**
- Test with multiple concurrent requests
- Check response times for large datasets
- Verify pagination works correctly

### **Edge Cases**
- Test with invalid IDs
- Test with missing required fields
- Test with expired tokens
- Test with role-based permissions

## 🎉 **Success Indicators**

✅ **Authentication working**: Can login and get tokens
✅ **CRUD operations**: Can create, read, update, delete internships
✅ **Applications**: Can apply and track applications
✅ **Filtering**: Search and filter work correctly
✅ **Role-based access**: Proper permissions enforced
✅ **Data integrity**: Relationships between collections maintained

Your SkillBridge API is now ready for comprehensive testing! 🚀

