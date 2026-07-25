from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import List
import re
from bson import ObjectId
import json
import urllib.request
import urllib.error

from app.config import JWT_SECRET, JWT_ALGORITHM, OPENAI_API_KEY, OPENAI_MODEL
from app.database import internships_collection, users_collection
from app.schemas.suggestion_schema import SuggestRequestSchema, ScoredInternshipSchema

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])
security = HTTPBearer()


def score_internship(skills: List[str], doc: dict) -> int:
    req = set([s.lower() for s in doc.get("required_skills", [])])
    pref = set([s.lower() for s in doc.get("preferred_skills", [])])
    have = set([s.lower() for s in skills])

    if not req and not pref:
        return 0

    req_overlap = len(have & req)
    pref_overlap = len(have & pref)

    # weight required higher
    score = req_overlap * 7 + pref_overlap * 3
    max_possible = max(len(req) * 7 + len(pref) * 3, 1)
    pct = int(round((score / max_possible) * 100))
    return min(max(pct, 0), 100)


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


@router.post("/internships", response_model=List[ScoredInternshipSchema])
async def suggest_internships(payload: SuggestRequestSchema, current_user: dict = Depends(get_current_user)):
    filters = {"status": "active"}
    if payload.preferred_work_type:
        filters["work_type"] = payload.preferred_work_type
    if payload.difficulty:
        filters["difficulty_level"] = payload.difficulty

    cur = internships_collection.find(filters).limit(200)
    items: List[ScoredInternshipSchema] = []

    for doc in cur:
        match = score_internship(payload.skills, doc)
        if match <= 0:
            continue
        items.append(
            ScoredInternshipSchema(
                id=str(doc["_id"]),
                title=doc.get("title"),
                company_name=doc.get("company_name"),
                match=match,
                reason="Skill overlap with required/preferred skills",
                duration_weeks=doc.get("duration_weeks", 0),
                work_type=doc.get("work_type"),
                difficulty_level=doc.get("difficulty_level"),
            )
        )

    items.sort(key=lambda x: x.match, reverse=True)
    return items[: payload.limit]


def _analyze_text_heuristics(text: str):
    t = re.sub(r"\s+", " ", text or "").strip()
    lc = t.lower()
    known_skills = [
        "javascript","react","typescript","node","express","python","django","flask","java","spring",
        "c++","c#","sql","mongodb","postgres","html","css","tailwind","next.js","react native","aws",
        "docker","kubernetes","git","data analysis","machine learning","ui/ux","figma","testing","jest"
    ]
    skills = sorted({s for s in known_skills if s.lower() in lc})
    has_numbers = re.search(r"\b\d{1,3}(%|\+|x|\s?(users|sales|revenue|customers|leads|bugs|issues))\b", t, re.I)
    has_links = re.search(r"(github\.com|linkedin\.com|portfolio|behance|dribbble|https?://)", t, re.I)
    has_summary = re.search(r"(summary|objective|about)", t, re.I)
    has_edu = re.search(r"(education|b\.?tech|bachelor|master|degree|university|college)", t, re.I)
    has_proj = re.search(r"(projects?|case studies|portfolio)", t, re.I)
    has_exp = re.search(r"(experience|intern|work|employment)", t, re.I)
    has_ats = re.search(r"\b(skills|experience|education|projects|certifications)\b", t, re.I)
    gaps = [g for g in ["TypeScript","Node.js","Database Design","Testing"] if not any(g.lower() in s for s in skills)]
    tips = []
    if not has_summary: tips.append("Add a brief 2–3 sentence Summary at the top focusing on your value and target role.")
    if not has_numbers: tips.append("Quantify impact with numbers (e.g., improved performance by 30%).")
    if not has_proj: tips.append("Include 2–3 Projects with tech stack, role, and measurable outcomes.")
    if not has_exp: tips.append("If limited work history, highlight internships/freelance/course projects as Experience.")
    if not has_edu: tips.append("Add Education with degree, institution, graduation year, and relevant coursework.")
    if not has_ats: tips.append("Use clear ATS-friendly headings: Skills, Experience, Projects, Education, Certifications.")
    if not has_links: tips.append("Add links to GitHub/LinkedIn/Portfolio to showcase your work.")
    if skills and gaps: tips.append("Consider learning " + ", ".join(gaps) + " to strengthen your profile.")
    experience = "Advanced" if re.search(r"\b(senior|lead)\b", t, re.I) else ("Beginner" if re.search(r"\b(intern|beginner|junior)\b", t, re.I) else "Intermediate")
    return {
        "skills": skills or ["JavaScript", "React"],
        "experience": experience,
        "tips": tips,
        "recommendations": {"skillGaps": gaps},
    }


@router.post("/analyze-resume", response_model=dict)
async def analyze_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        name = (file.filename or "").lower()
        if not (name.endswith(".pdf") or name.endswith(".doc") or name.endswith(".docx")):
            raise HTTPException(status_code=400, detail="Only PDF, DOC, and DOCX files are supported")

        text = ""
        # Read limited bytes for speed and safety
        raw = await file.read(800_000)

        # Extract text based on extension
        if name.endswith(".docx"):
            # Extract text from DOCX (zip) without external deps
            import io, zipfile, html
            try:
                with zipfile.ZipFile(io.BytesIO(raw)) as zf:
                    with zf.open("word/document.xml") as doc_xml:
                        xml_bytes = doc_xml.read()
                        xml_text = xml_bytes.decode("utf-8", errors="ignore")
                        # Remove XML tags and unescape entities
                        no_tags = re.sub(r"<[^>]+>", " ", xml_text)
                        text = html.unescape(re.sub(r"\s+", " ", no_tags)).strip()
            except Exception:
                text = ""
        else:
            # Naive decode for PDF/DOC: decode and keep printable chars
            try:
                text = raw.decode("utf-8", errors="ignore")
            except Exception:
                try:
                    text = raw.decode("latin-1", errors="ignore")
                except Exception:
                    text = ""
            # Keep mostly readable characters
            text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E]", " ", text)
            text = re.sub(r"\s+", " ", text).strip()

        # If OpenAI is configured, try LLM-enhanced parsing first
        if OPENAI_API_KEY:
            try:
                prompt = (
                    "You are a resume analyzer. Extract the following as strict JSON with keys: "
                    "skills (array of strings), experience (one of Beginner, Intermediate, Advanced), "
                    "tips (array of short actionable strings), recommendations (object with key skillGaps: array of strings).\n"
                    "Input resume text between <resume> tags and output ONLY the JSON.\n\n"
                    f"<resume>\n{text[:8000]}\n</resume>"
                )

                # Use Chat Completions REST to avoid SDK dependency
                headers = {
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                }
                body = {
                    "model": OPENAI_MODEL or "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "You extract structured data from resumes."},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.2,
                }
                # Retry up to 2 times on transient network failures
                content = "{}"
                for attempt in range(3):
                    req = urllib.request.Request(
                        url="https://api.openai.com/v1/chat/completions",
                        method="POST",
                        headers=headers,
                        data=json.dumps(body).encode("utf-8"),
                    )
                    try:
                        with urllib.request.urlopen(req, timeout=25) as resp:
                            raw = resp.read().decode("utf-8", errors="ignore")
                            data = json.loads(raw)
                            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
                            break
                    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
                        # Backoff: 0.2s, 0.6s then give up
                        import time
                        time.sleep(0.2 * (attempt + 1) ** 2)
                try:
                    parsed = json.loads(content)
                    # Basic normalization
                    skills = parsed.get("skills") or []
                    experience = parsed.get("experience") or "Intermediate"
                    tips = parsed.get("tips") or []
                    recs = parsed.get("recommendations") or {}
                    gaps = recs.get("skillGaps") or []
                    return {
                        "skills": skills,
                        "experience": experience,
                        "tips": tips,
                        "recommendations": {"skillGaps": gaps},
                        "source": "openai",
                    }
                except json.JSONDecodeError:
                    # Fall through to heuristic on bad JSON
                    pass
                # Non-200 or parse failure -> fallback
            except Exception:
                # Ignore LLM errors and fallback
                pass

        # Heuristic fallback
        result = _analyze_text_heuristics(text)
        result["source"] = "heuristic"
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to analyze resume: {e}")
