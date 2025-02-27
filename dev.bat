@echo off
setlocal enabledelayedexpansion

:: Check if backend directory exists
if not exist "backend" (
    echo Backend directory not found. Using current directory for backend.
    set "BACKEND_DIR=."
) else (
    set "BACKEND_DIR=backend"
)

:: Check if frontend directory exists
if not exist "frontend" (
    echo Frontend directory not found. Using current directory for frontend.
    set "FRONTEND_DIR=."
) else (
    set "FRONTEND_DIR=frontend"
)

:: Start backend server in a new window
echo Starting Python backend server...
start "Python Backend" cmd /c "cd /d %BACKEND_DIR% && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat)) && (if exist requirements.txt (pip install -r requirements.txt)) && (if exist run.py (python run.py) else if exist main.py (python main.py) else (echo Could not find app.py or main.py in backend directory && exit /b 1))"

:: Start frontend server in a new window
echo Starting Next.js frontend server...
start "Next.js Frontend" cmd /c "cd /d %FRONTEND_DIR% && (if exist package.json (npm install && npm run dev) else (echo Could not find package.json in frontend directory && exit /b 1))"

echo Development servers are running!
echo Close the terminal windows to stop the servers

endlocal 