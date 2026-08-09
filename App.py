import secrets
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Header, Query, status
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Blog Engine API")

# ─── Security & Models ────────────────────────────────────────────────────────

# In-memory user database
USERS_DB = {}
ACTIVE_TOKENS = {}  # token -> email

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    username: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PostCreate(BaseModel):
    title: str
    excerpt: str
    category: str
    readTime: str
    tags: List[str] = []
    image: Optional[str] = None
    content: str
    featured: bool = False
    size: str = "medium"

# ─── Auth Endpoints ───────────────────────────────────────────────────────────

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):
    if user.email in USERS_DB:
        raise HTTPException(status_code=400, detail="Account with this email already exists.")
    
    USERS_DB[user.email] = {
        "username": user.username,
        "password": user.password,  # Note: Use passlib / bcrypt hashing in production
    }
    return {"message": "Account created successfully!"}

@app.post("/api/auth/login")
def login(credentials: UserLogin):
    user = USERS_DB.get(credentials.email)
    if not user or user["password"] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    # Generate a simple auth token
    token = secrets.token_hex(16)
    ACTIVE_TOKENS[token] = credentials.email
    
    return {
        "token": token,
        "user": {"email": credentials.email, "username": user["username"]}
    }

# Helper to verify auth header
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required.")
    token = authorization.split(" ")[1]
    if token not in ACTIVE_TOKENS:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    return ACTIVE_TOKENS[token]

# ─── Post Creation (Protected Route) ──────────────────────────────────────────

@app.post("/api/posts", status_code=status.HTTP_201_CREATED)
def create_post(post: PostCreate, authorization: Optional[str] = Header(None)):
    user_email = get_current_user(authorization)
    
    # Process and save new post logic here...
    return {"message": "Post published successfully!", "author": user_email}