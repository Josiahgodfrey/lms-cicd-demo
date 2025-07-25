// Learning Management System Web Application
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory data storage (in production, this would be a database)
let users = [];
let courses = [];
let nextUserId = 1;
let nextCourseId = 1;

// User Management Class
class User {
    constructor(name, email, role = 'student') {
        if (!name || !email) {
            throw new Error('Name and email are required');
        }
        
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        
        if (!['admin', 'instructor', 'student'].includes(role)) {
            throw new Error('Invalid role. Must be admin, instructor, or student');
        }
        
        this.id = nextUserId++;
        this.name = name;
        this.email = email;
        this.role = role;
        this.enrolledCourses = [];
        this.createdAt = new Date().toISOString();
        this.isActive = true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    enrollInCourse(courseId) {
        if (!this.enrolledCourses.includes(courseId)) {
            this.enrolledCourses.push(courseId);
            return true;
        }
        return false;
    }
}

// Course Management Class
class Course {
    constructor(title, description, instructorId) {
        if (!title || !description || !instructorId) {
            throw new Error('Title, description, and instructor ID are required');
        }
        
        this.id = nextCourseId++;
        this.title = title;
        this.description = description;
        this.instructorId = instructorId;
        this.enrolledStudents = [];
        this.maxStudents = 50;
        this.isPublished = false;
        this.createdAt = new Date().toISOString();
    }
    
    enrollStudent(studentId) {
        if (this.enrolledStudents.length >= this.maxStudents) {
            throw new Error('Course is at maximum capacity');
        }
        
        if (!this.enrolledStudents.includes(studentId)) {
            this.enrolledStudents.push(studentId);
            return true;
        }
        return false;
    }
    
    publish() {
        this.isPublished = true;
    }
}

// API Routes

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: Math.floor(process.uptime())
    });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        message: '🎓 Welcome to the Learning Management System!',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            users: {
                create: 'POST /api/users',
                list: 'GET /api/users',
                get: 'GET /api/users/:id'
            },
            courses: {
                create: 'POST /api/courses',
                list: 'GET /api/courses',
                get: 'GET /api/courses/:id',
                publish: 'PUT /api/courses/:id/publish',
                enroll: 'POST /api/courses/:id/enroll'
            }
        },
        stats: {
            totalUsers: users.length,
            totalCourses: courses.length
        }
    });
});

// User endpoints
app.post('/api/users', (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        
        const user = new User(name, email, role);
        users.push(user);
        
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users', (req, res) => {
    const userList = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: user.enrolledCourses.length,
        createdAt: user.createdAt
    }));
    
    res.json({
        users: userList,
        total: users.length
    });
});

app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: user.enrolledCourses,
        createdAt: user.createdAt
    });
});

// Course endpoints
app.post('/api/courses', (req, res) => {
    try {
        const { title, description, instructorId } = req.body;
        
        // Verify instructor exists
        const instructor = users.find(u => u.id === instructorId && u.role === 'instructor');
        if (!instructor) {
            return res.status(400).json({ error: 'Invalid instructor ID' });
        }
        
        const course = new Course(title, description, instructorId);
        courses.push(course);
        
        res.status(201).json({
            message: 'Course created successfully',
            course: {
                id: course.id,
                title: course.title,
                description: course.description,
                instructorId: course.instructorId,
                instructorName: instructor.name,
                enrolledStudents: course.enrolledStudents.length,
                maxStudents: course.maxStudents,
                isPublished: course.isPublished,
                createdAt: course.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/courses', (req, res) => {
    const courseList = courses.map(course => {
        const instructor = users.find(u => u.id === course.instructorId);
        return {
            id: course.id,
            title: course.title,
            description: course.description,
            instructorName: instructor ? instructor.name : 'Unknown',
            enrolledStudents: course.enrolledStudents.length,
            maxStudents: course.maxStudents,
            isPublished: course.isPublished,
            createdAt: course.createdAt
        };
    });
    
    res.json({
        courses: courseList,
        total: courses.length
    });
});

app.get('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    const instructor = users.find(u => u.id === course.instructorId);
    
    res.json({
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: instructor ? instructor.name : 'Unknown',
        enrolledStudents: course.enrolledStudents,
        maxStudents: course.maxStudents,
        isPublished: course.isPublished,
        createdAt: course.createdAt
    });
});

// Publish course
app.put('/api/courses/:id/publish', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    course.publish();
    
    res.json({
        message: 'Course published successfully',
        course: {
            id: course.id,
            title: course.title,
            isPublished: course.isPublished
        }
    });
});

// Enroll student in course
app.post('/api/courses/:id/enroll', (req, res) => {
    try {
        const courseId = parseInt(req.params.id);
        const { studentId } = req.body;
        
        const course = courses.find(c => c.id === courseId);
        const student = users.find(u => u.id === studentId && u.role === 'student');
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        if (!course.isPublished) {
            return res.status(400).json({ error: 'Course is not published' });
        }
        
        course.enrollStudent(studentId);
        student.enrollInCourse(courseId);
        
        res.json({
            message: 'Student enrolled successfully',
            student: student.name,
            course: course.title,
            enrollmentCount: course.enrolledStudents.length
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server only if this file is run directly (not during testing)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🎓 LMS Server running on port ${port}`);
        console.log(`📊 Health check: http://localhost:${port}/health`);
        console.log(`🌐 API documentation: http://localhost:${port}/`);
    });
}

// Export for testing
module.exports = { app, User, Course };
