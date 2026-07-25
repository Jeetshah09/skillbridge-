from pymongo import MongoClient
from app.config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["smart_internship_db"]

# Collections
users_collection = db["users"]
internships_collection = db["internships"]
applications_collection = db["applications"]
notifications_collection = db["notifications"]
messages_collection = db["messages"]
conversations_collection = db["conversations"]
password_reset_tokens_collection = db["password_reset_tokens"]
