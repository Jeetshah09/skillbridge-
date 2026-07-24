# SkillBridge 🚀

### Smart Internship & Job Finder Portal

SkillBridge is a full-stack web application designed to bridge the gap between students and career opportunities by helping users discover relevant internships and job opportunities based on their skills, interests, and career goals.

The platform provides a centralized space where students can build their profiles, explore opportunities, track applications, and improve their career readiness.

---

## 📌 Project Overview

Finding the right internship or job opportunity is challenging for students due to scattered information across multiple platforms. SkillBridge solves this problem by providing a smart and user-friendly platform that connects students with suitable career opportunities.

The system focuses on skill-based matching, opportunity discovery, and application management to create a better recruitment experience for both students and recruiters.

---

# ✨ Features

## 👨‍🎓 Student Module

* User registration and authentication
* Create and manage personal profiles
* Add skills, education, projects, and experience
* Search internships and job opportunities
* Apply for suitable opportunities
* Track application status
* View recommended opportunities based on skills

---

## 🏢 Recruiter Module

* Recruiter registration and authentication
* Create company profiles
* Post internship and job opportunities
* Manage applications received
* View candidate profiles
* Shortlist suitable candidates

---

## 🔍 Smart Opportunity Matching

* Skill-based opportunity recommendations
* Match student profiles with available roles
* Reduce the gap between candidate skills and industry requirements

---

## 📊 Dashboard

* Personalized student dashboard
* Application tracking
* Opportunity overview
* Profile completion insights

---

# 🛠️ Tech Stack

## Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Tailwind CSS

## Backend

* FastAPI (Python)
* REST API Architecture
* Uvicorn Server

## Database

* MySQL / PostgreSQL

## Tools & Technologies

* Git & GitHub
* VS Code
* Postman
* REST API Testing

---

# 🏗️ System Architecture

```
                 User
                  |
                  |
            Frontend (React)
                  |
                  |
             REST API
                  |
                  |
          Backend (FastAPI)
                  |
                  |
              Database
```

---

# 📂 Project Structure

```
SkillBridge
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── package.json
│
├── backend
│   ├── app
│   ├── routes
│   ├── models
│   ├── database
│   ├── requirements.txt
│   └── main.py
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/SkillBridge.git
```

Move into project directory:

```bash
cd SkillBridge
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn main:app --reload
```

Backend will run on:

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

# 🎯 Project Goals

* Help students discover relevant career opportunities
* Reduce the difficulty of internship/job searching
* Improve skill-based recruitment
* Create a bridge between students and organizations

---

# 👨‍💻 Developed By

**Jeet Shah**

Computer Engineering Student

#📄 License

This project is developed for educational and learning purposes.
