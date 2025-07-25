#!/bin/bash

# 🎨 LMS Frontend - Linux/Ubuntu Startup Script

echo ""
echo "==============================================="
echo "     🎨 LMS Frontend (React + Vite)"
echo "        Linux/Ubuntu Startup Script"
echo "==============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}📦${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed or not in PATH"
    echo "📥 Please install Node.js:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm"
    echo "  CentOS/RHEL:   sudo yum install nodejs npm"
    echo "  Or download from: https://nodejs.org/"
    echo ""
    exit 1
fi

print_info "Node.js version: $(node --version)"
echo ""

# Navigate to frontend directory
if [ -d "../frontend" ]; then
    cd ../frontend
elif [ -d "frontend" ]; then
    cd frontend
else
    print_error "Frontend directory not found"
    echo "📁 Please run this script from the LMS project root or scripts directory"
    echo ""
    exit 1
fi

print_info "Current directory: $(pwd)"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found"
    echo "📁 Please ensure you're in the correct directory"
    echo ""
    exit 1
fi

# Install dependencies
echo "🔧 Installing frontend dependencies..."
if npm install; then
    print_status "Frontend dependencies installed successfully!"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
echo ""

# Run tests
echo "🧪 Running frontend tests..."
if npm test -- --run; then
    print_status "All frontend tests passed!"
else
    print_warning "Some frontend tests failed, but continuing..."
fi
echo ""

# Check for port conflicts
if command -v netstat &> /dev/null; then
    if netstat -tuln | grep -q ":5173 "; then
        print_warning "Port 5173 is already in use"
        echo "The frontend may not start correctly or will use a different port"
        echo ""
    fi
fi

echo "🚀 Starting LMS Frontend Development Server..."
echo "📍 The frontend will be available at: http://localhost:5173"
echo "🔗 API proxy: Backend requests will be proxied to http://localhost:3000"
echo ""
echo "💡 Make sure the backend server is running on port 3000"
echo "🔴 Press Ctrl+C to stop the frontend server"
echo ""

# Function to handle cleanup on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down Frontend Development Server..."
    print_status "Frontend Development Server has stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the frontend development server
npm run dev

# If we reach here, the server has stopped
echo ""
print_status "Frontend Development Server has stopped"
