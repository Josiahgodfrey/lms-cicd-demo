@echo off
REM 🎨 LMS Frontend - Windows Startup Script
echo.
echo ===============================================
echo     🎨 LMS Frontend (React + Vite)
echo         Windows Startup Script
echo ===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo 📥 Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo 📦 Node.js version:
node --version
echo.

REM Navigate to frontend directory
if exist "..\frontend" (
    cd ..\frontend
) else if exist "frontend" (
    cd frontend
) else (
    echo ❌ Frontend directory not found
    echo 📁 Please run this script from the LMS project root or scripts directory
    echo.
    pause
    exit /b 1
)

echo 📁 Current directory: %CD%
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Frontend package.json not found
    echo 📁 Please ensure you're in the correct directory
    echo.
    pause
    exit /b 1
)

echo 🔧 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    echo.
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully!
echo.

echo 🧪 Running frontend tests...
npm test -- --run
if %errorlevel% neq 0 (
    echo ⚠️  Some frontend tests failed, but continuing...
)
echo.

echo 🚀 Starting LMS Frontend Development Server...
echo 📍 The frontend will be available at: http://localhost:5173
echo 🔗 API proxy: Backend requests will be proxied to http://localhost:3000
echo.
echo 💡 Make sure the backend server is running on port 3000
echo 🔴 Press Ctrl+C to stop the frontend server
echo.

REM Start the frontend development server
npm run dev

REM If we reach here, the server has stopped
echo.
echo 🛑 Frontend Development Server has stopped
pause
