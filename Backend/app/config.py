import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretjwtkey")
JWT_ALGORITHM = "HS256"
OPENAI_API_KEY = os.getenv("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")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
