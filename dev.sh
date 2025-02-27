#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to handle script termination
cleanup() {
    echo -e "\n${BLUE}Shutting down development servers...${NC}"
    # Kill all child processes
    pkill -P $$
    exit 0
}

# Set up trap for SIGINT (Ctrl+C)
trap cleanup SIGINT

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${BLUE}Backend directory not found. Using current directory for backend.${NC}"
    BACKEND_DIR="."
else
    BACKEND_DIR="backend"
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${BLUE}Frontend directory not found. Using current directory for frontend.${NC}"
    FRONTEND_DIR="."
else
    FRONTEND_DIR="frontend"
fi

# Start backend server
echo -e "${GREEN}Starting Python backend server...${NC}"
cd "$BACKEND_DIR" || exit
python -m venv venv 2>/dev/null || true
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi
if [ -f "app.py" ]; then
    python app.py &
elif [ -f "main.py" ]; then
    python main.py &
else
    echo "Could not find app.py or main.py in backend directory"
    exit 1
fi
BACKEND_PID=$!
cd - > /dev/null || exit

# Start frontend server
echo -e "${GREEN}Starting Next.js frontend server...${NC}"
cd "$FRONTEND_DIR" || exit
if [ -f "package.json" ]; then
    npm install
    npm run dev &
else
    echo "Could not find package.json in frontend directory"
    exit 1
fi
FRONTEND_PID=$!
cd - > /dev/null || exit

echo -e "${GREEN}Development servers are running!${NC}"
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 