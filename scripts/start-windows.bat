@echo off
REM 🎓 Learning Management System - Windows Startup Script
echo.
echo ===============================================
echo    🎓 LMS - Learning Management System
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

REM Display Node.js version
echo 📦 Node.js version:
node --version
echo.

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    echo 📥 Please ensure npm is installed with Node.js
    echo.
    pause
    exit /b 1
)

REM Display npm version
echo 📦 npm version:
npm --version
echo.

REM Navigate to project directory if script is run from scripts folder
if exist "..\package.json" (
    cd ..
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found
    echo 📁 Please run this script from the LMS project root directory
    echo.
    pause
    exit /b 1
)

echo 🔧 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    echo.
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!
echo.

echo 🧪 Running tests...
npm test
if %errorlevel% neq 0 (
    echo ⚠️  Some tests failed, but continuing...
)
echo.

echo 🚀 Starting LMS Backend Server...
echo 📍 The server will be available at: http://localhost:3000
echo 📊 Health check: http://localhost:3000/health
echo 📚 API documentation: http://localhost:3000/
echo.
echo 🔴 Press Ctrl+C to stop the server
echo.

REM Start the application
node app.js

REM If we reach here, the server has stopped
echo.
echo 🛑 LMS Server has stopped
pause
