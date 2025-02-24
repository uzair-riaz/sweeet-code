import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///sweeet_code.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Judge0 Configuration
    JUDGE0_HOST = "https://judge0-ce.p.rapidapi.com"
    JUDGE0_API_KEY = os.environ.get('RAPID_API_KEY') or "4fa914bde0mshb1225ff4d41d730p1c9e9djsnb1fd3c1465e4"  # Get this from RapidAPI
    
    # Language IDs for Judge0
    LANGUAGE_IDS = {
        "cpp": 54,      # C++ (GCC 9.2.0)
        "python": 71,   # Python (3.8.1)
        "javascript": 63,  # JavaScript (Node.js 12.14.0)
        "java": 62,     # Java (OpenJDK 13.0.1)
        "typescript": 74,  # TypeScript (3.7.4)
        "go": 60,       # Go (1.13.5)
        "rust": 73,     # Rust (1.40.0)
    } 