# 🖥️ Cross-Platform Installation Guide

This guide will help you set up and run the Learning Management System (LMS) on both **Ubuntu/Linux** and **Windows** systems.

## 📋 Prerequisites

### Required Software
- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **Docker** (optional, for containerized deployment)

---

## 🐧 Ubuntu/Linux Installation

### Step 1: Install Node.js and npm

#### Option A: Using NodeSource Repository (Recommended)
```bash
# Update package index
sudo apt update

# Install curl if not already installed
sudo apt install -y curl

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### Option B: Using Ubuntu Package Manager
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Check versions (may be older)
node --version
npm --version
```

#### Option C: Using Snap
```bash
# Install Node.js via snap
sudo snap install node --classic

# Verify installation
node --version
npm --version
```

### Step 2: Clone and Setup the Project

```bash
# Clone the repository
git clone https://github.com/josiahgodfrey/lms-cicd-demo.git
cd lms-cicd-demo

# Make scripts executable
chmod +x scripts/start-linux.sh
chmod +x scripts/start-frontend-linux.sh

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Run the Application

#### Option A: Using Scripts (Recommended)
```bash
# Start backend (Terminal 1)
./scripts/start-linux.sh

# Start frontend (Terminal 2 - new terminal)
./scripts/start-frontend-linux.sh
```

#### Option B: Manual Start
```bash
# Start backend (Terminal 1)
npm start

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

### Step 4: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

## 🪟 Windows Installation

### Step 1: Install Node.js and npm

#### Option A: Download from Official Website (Recommended)
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** for Windows
3. Run the installer (.msi file)
4. Follow the installation wizard
5. Restart your computer

#### Option B: Using Chocolatey (Package Manager)
```powershell
# Install Chocolatey first (if not installed)
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs

# Verify installation
node --version
npm --version
```

#### Option C: Using Windows Package Manager (winget)
```powershell
# Install Node.js
winget install OpenJS.NodeJS

# Verify installation
node --version
npm --version
```

### Step 2: Clone and Setup the Project

#### Using Git Bash (Recommended)
```bash
# Clone the repository
git clone https://github.com/josiahgodfrey/lms-cicd-demo.git
cd lms-cicd-demo

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### Using Command Prompt
```cmd
# Clone the repository
git clone https://github.com/josiahgodfrey/lms-cicd-demo.git
cd lms-cicd-demo

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Run the Application

#### Option A: Using Scripts (Recommended)
```cmd
# Start backend (Command Prompt 1)
scripts\start-windows.bat

# Start frontend (Command Prompt 2 - new window)
scripts\start-frontend-windows.bat
```

#### Option B: Manual Start
```cmd
# Start backend (Command Prompt 1)
npm start

# Start frontend (Command Prompt 2)
cd frontend
npm run dev
```

### Step 4: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

## 🐳 Docker Installation (Cross-Platform)

### Prerequisites
- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose**

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/josiahgodfrey/lms-cicd-demo.git
cd lms-cicd-demo

# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Docker Commands

```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up --build --force-recreate
```

---

## 🧪 Testing

### Run Backend Tests
```bash
# Linux/Mac
npm test

# Windows
npm test
```

### Run Frontend Tests
```bash
# Navigate to frontend directory
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
**Problem**: Error "Port 3000 already in use"
**Solution**:
```bash
# Linux/Mac - Find and kill process using port 3000
sudo lsof -ti:3000 | xargs kill -9

# Windows - Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### Permission Denied (Linux)
**Problem**: Permission denied when running scripts
**Solution**:
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

#### Node.js Version Issues
**Problem**: Application requires Node.js 18+
**Solution**:
```bash
# Check your Node.js version
node --version

# Use Node Version Manager (nvm) to install correct version
# Linux/Mac
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Windows (using nvm-windows)
# Download and install from: https://github.com/coreybutler/nvm-windows
nvm install 18.0.0
nvm use 18.0.0
```

#### npm Install Fails
**Problem**: npm install fails with permission errors
**Solution**:
```bash
# Linux - Don't use sudo with npm, configure npm properly
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Windows - Run Command Prompt as Administrator
# Right-click Command Prompt → "Run as Administrator"
```

---

## 🌐 Environment Variables

Create a `.env` file in the project root for custom configuration:

```env
# Backend Configuration
PORT=3000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

---

## 📊 System Requirements

### Minimum Requirements
- **RAM**: 4GB
- **Storage**: 2GB free space
- **CPU**: Dual-core processor
- **OS**: 
  - Ubuntu 18.04+ / Linux with kernel 3.10+
  - Windows 10+ / Windows Server 2019+

### Recommended Requirements
- **RAM**: 8GB+
- **Storage**: 5GB+ free space
- **CPU**: Quad-core processor
- **OS**: Latest stable versions

---

## 🆘 Getting Help

1. **Check the logs** in your terminal for error messages
2. **Verify Node.js version**: `node --version` (should be 18+)
3. **Check port availability**: Make sure ports 3000 and 5173 are free
4. **Review the GitHub Issues**: [Repository Issues](https://github.com/josiahgodfrey/lms-cicd-demo/issues)
5. **Create a new issue** with your system details and error messages

---

## 🚀 Next Steps

After successful installation:

1. **Explore the API**: Visit http://localhost:3000 for API documentation
2. **Create test users**: Use the frontend to create instructors and students
3. **Create courses**: Add sample courses to test the system
4. **Review the code**: Examine the source code to understand the architecture
5. **Run tests**: Execute the test suite to ensure everything works correctly

Happy coding! 🎓
