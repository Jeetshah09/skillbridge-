from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, internship_routes, notification_routes
from app.routes import message_routes, suggestion_routes
from app.routes import admin_routes, hr_routes, skill_matching_routes

app = FastAPI(title="Smart Internship & Job Finder Backend")

# Configure CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_routes.router)
app.include_router(internship_routes.router)
app.include_router(notification_routes.router)
app.include_router(message_routes.router)
app.include_router(suggestion_routes.router)
app.include_router(admin_routes.router)
app.include_router(hr_routes.router)
app.include_router(skill_matching_routes.router)

@app.get("/")
def root():
    return {"message": "Welcome to Smart Internship & Job Finder API 🚀"}
