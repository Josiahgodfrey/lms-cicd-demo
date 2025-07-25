# 🎓 Learning Management System (LMS) - CI/CD Demo

[![🎓 LMS CI/CD Pipeline](https://github.com/josiahgodfrey/lms-cicd-demo/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/josiahgodfrey/lms-cicd-demo/actions/workflows/ci-cd.yml)

A comprehensive Learning Management System built with Node.js, featuring a complete CI/CD pipeline with automated testing, Docker containerization, and deployment.

## 🚀 Features

- **User Management**: Create and manage students, instructors, and admins
- **Course Management**: Create, publish, and manage courses
- **Enrollment System**: Students can enroll in published courses
- **RESTful API**: Complete REST API for all operations
- **Docker Support**: Containerized application for easy deployment
- **CI/CD Pipeline**: Automated testing, building, and deployment

## 📋 API Endpoints

### Health Check
- `GET /health` - Application health status
- `GET /` - API documentation

### User Management
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user

### Course Management
- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `PUT /api/courses/:id/publish` - Publish a course
- `POST /api/courses/:id/enroll` - Enroll student in course

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

### 🖥️ Cross-Platform Support
This application runs on:
- ✅ **Ubuntu/Linux** (18.04+)
- ✅ **Windows** (10+)
- ✅ **macOS** (10.15+)
- ✅ **Docker** (any platform)

### Local Development

#### 🐧 Linux/Ubuntu
```bash
# Clone the repository
git clone https://github.com/josiahgodfrey/lms-cicd-demo.git
cd lms-cicd-demo

# Quick start with scripts
./scripts/start-linux.sh          # Backend (Terminal 1)
./scripts/start-frontend-linux.sh  # Frontend (Terminal 2)
```

#### 🪟 Windows
```cmd
REM Clone the repository
git clone https://github.com/josiahgodfrey/lms-cicd-demo.git
cd lms-cicd-demo

REM Quick start with scripts
scripts\start-windows.bat          REM Backend (CMD 1)
scripts\start-frontend-windows.bat REM Frontend (CMD 2)
```

#### 📋 Manual Setup (All Platforms)
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Start backend (Terminal 1)
npm start

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

#### 🧪 Testing
```bash
# Backend tests
npm test

# Frontend tests
cd frontend && npm test

# Coverage reports
npm run test:coverage
```

📖 **Detailed Installation Guide**: See [INSTALLATION.md](INSTALLATION.md) for comprehensive setup instructions.

### Docker

1. **Build the Docker image**
   ```bash
   docker build -t lms-cicd-demo .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 lms-cicd-demo
   ```

## 🧪 Testing

The project includes comprehensive tests covering:

- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Performance Tests**: Response time monitoring
- **Security Tests**: Vulnerability scanning

Run all tests:
```bash
npm test
```

## 🔄 CI/CD Pipeline

Our GitHub Actions pipeline includes:

1. **🧪 Testing & Quality Checks**
   - Unit tests
   - Code coverage
   - Code quality analysis

2. **🔒 Security Scanning**
   - Dependency vulnerability checks
   - Security audit

3. **🏗️ Build Process**
   - Application compilation
   - Artifact creation

4. **🐳 Docker Operations**
   - Container building
   - Image testing

5. **🚀 Deployment**
   - Staging deployment
   - Smoke tests

6. **🔗 Integration Testing**
   - End-to-end workflows
   - API integration tests

7. **⚡ Performance Testing**
   - Response time monitoring
   - Load testing

8. **📢 Notifications**
   - Pipeline status reporting
   - Deployment summaries

## 📊 Pipeline Status

You can monitor the CI/CD pipeline status by:

1. **Going to the Actions tab** in this repository
2. **Viewing the workflow runs** for each commit
3. **Checking the badge** at the top of this README

## 🌐 Live Demo

- **Staging Environment**: https://staging.lms-demo.com
- **Health Check**: https://staging.lms-demo.com/health
- **API Documentation**: https://staging.lms-demo.com/

## 🛠️ Project Structure

```
lms-cicd-demo/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore rules
├── .github/
│   └── workflows/
│       └── ci-cd.yml     # CI/CD pipeline
├── tests/
│   └── api.test.js       # Test suite
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

The CI/CD pipeline will automatically run tests and quality checks on your pull request.

## 📈 Monitoring

The application includes built-in monitoring:

- **Health Checks**: `/health` endpoint for monitoring tools
- **Performance Metrics**: Response time tracking
- **Error Logging**: Comprehensive error reporting

## 🔧 Configuration

Environment variables:
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## 📝 License

MIT License - see LICENSE file for details.

## 👨‍💻 Authors

- **Josiah Godfrey** - [@josiahgodfrey](https://github.com/josiahgodfrey)

---

🎓 **Happy Learning!** This project demonstrates modern DevOps practices with a complete CI/CD pipeline.
