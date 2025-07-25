#!/bin/bash

# 🎓 Learning Management System - Linux/Ubuntu Startup Script

echo ""
echo "==============================================="
echo "    🎓 LMS - Learning Management System"
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

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root is not recommended for development"
    echo "Consider running as a regular user for security"
    echo ""
fi

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

# Display Node.js version
print_info "Node.js version: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not available"
    echo "📥 Please install npm:"
    echo "  Ubuntu/Debian: sudo apt install npm"
    echo "  Or ensure it's included with your Node.js installation"
    echo ""
    exit 1
fi

# Display npm version
print_info "npm version: $(npm --version)"
echo ""

# Navigate to project directory if script is run from scripts folder
if [ -f "../package.json" ]; then
    cd ..
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found"
    echo "📁 Please run this script from the LMS project root directory"
    echo ""
    exit 1
fi

# Display system information
print_info "Operating System: $(uname -s)"
print_info "Architecture: $(uname -m)"
print_info "Current directory: $(pwd)"
echo ""

# Install dependencies
echo "🔧 Installing dependencies..."
if npm install; then
    print_status "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies"
    exit 1
fi
echo ""

# Run tests
echo "🧪 Running tests..."
if npm test; then
    print_status "All tests passed!"
else
    print_warning "Some tests failed, but continuing..."
fi
echo ""

# Check for required ports
if command -v netstat &> /dev/null; then
    if netstat -tuln | grep -q ":3000 "; then
        print_warning "Port 3000 is already in use"
        echo "The application may not start correctly"
        echo "Please stop any services using port 3000 or change the PORT environment variable"
        echo ""
    fi
fi

# Set up environment
export NODE_ENV=development
export PORT=3000

echo "🚀 Starting LMS Backend Server..."
echo "📍 The server will be available at: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/health"
echo "📚 API documentation: http://localhost:3000/"
echo ""
echo "🔴 Press Ctrl+C to stop the server"
echo ""

# Function to handle cleanup on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down LMS Server..."
    print_status "LMS Server has stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the application
node app.js

# If we reach here, the server has stopped
echo ""
print_status "LMS Server has stopped"
