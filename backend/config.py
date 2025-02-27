import os
from datetime import timedelta
import redis

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    
    # PostgreSQL configuration
    DB_USER = os.environ.get('DB_USER', 'postgres')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'postgres')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    DB_NAME = os.environ.get('DB_NAME', 'sweeet_code')
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Redis Configuration
    REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
    REDIS_PORT = os.environ.get('REDIS_PORT', '6379')
    REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', '')
    REDIS_URL = os.environ.get('REDIS_URL') or \
        f'redis://{":"+REDIS_PASSWORD+"@" if REDIS_PASSWORD else ""}{REDIS_HOST}:{REDIS_PORT}/0'
    
    # Cache Configuration
    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_URL = REDIS_URL
    CACHE_DEFAULT_TIMEOUT = 300  # 5 minutes
    
    # Judge0 Configuration
    JUDGE0_HOST = "https://judge0-ce.p.rapidapi.com"
    JUDGE0_API_KEY = os.environ.get('RAPID_API_KEY') or "4fa914bde0mshb1225ff4d41d730p1c9e9djsnb1fd3c1465e4"
    
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