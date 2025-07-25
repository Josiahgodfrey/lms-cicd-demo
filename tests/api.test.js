const request = require('supertest');
const { app } = require('../app');

describe('LMS API Tests', () => {
  describe('Health Check', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Root Endpoint', () => {
    test('GET / should return API documentation', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body.message).toContain('Welcome to the Learning Management System');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.stats).toBeDefined();
    });
  });

  describe('User Management', () => {
    test('POST /api/users should create a new student', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.user.id).toBeDefined();
    });

    test('POST /api/users should create an instructor', async () => {
      const userData = {
        name: 'Dr. Jane Smith',
        email: 'jane@example.com',
        role: 'instructor'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.user.role).toBe('instructor');
    });

    test('POST /api/users should reject invalid email', async () => {
      const userData = {
        name: 'Invalid User',
        email: 'invalid-email',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('Invalid email format');
    });

    test('POST /api/users should reject missing required fields', async () => {
      const userData = {
        name: 'Incomplete User'
        // Missing email
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('Name and email are required');
    });

    test('POST /api/users should reject invalid role', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'invalid-role'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('Invalid role');
    });

    test('POST /api/users should reject duplicate email', async () => {
      const userData = {
        name: 'First User',
        email: 'duplicate@example.com',
        role: 'student'
      };

      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const duplicateData = {
        name: 'Second User',
        email: 'duplicate@example.com',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/users')
        .send(duplicateData)
        .expect(400);

      expect(response.body.error).toContain('User with this email already exists');
    });

    test('GET /api/users should return all users', async () => {
      // Create a user first
      await request(app)
        .post('/api/users')
        .send({
          name: 'List Test User',
          email: 'listtest@example.com',
          role: 'student'
        });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.users).toBeDefined();
      expect(response.body.total).toBeGreaterThan(0);
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    test('GET /api/users/:id should return specific user', async () => {
      // Create a user first
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Specific User',
          email: 'specific@example.com',
          role: 'student'
        });

      const userId = createResponse.body.user.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.name).toBe('Specific User');
      expect(response.body.email).toBe('specific@example.com');
    });

    test('GET /api/users/:id should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });

  describe('Course Management', () => {
    let instructorId;

    beforeEach(async () => {
      // Create an instructor for course tests
      const instructorResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Course Instructor',
          email: `instructor${Date.now()}@example.com`,
          role: 'instructor'
        });
      instructorId = instructorResponse.body.user.id;
    });

    test('POST /api/courses should create a new course', async () => {
      const courseData = {
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming',
        instructorId: instructorId
      };

      const response = await request(app)
        .post('/api/courses')
        .send(courseData)
        .expect(201);

      expect(response.body.message).toBe('Course created successfully');
      expect(response.body.course.title).toBe(courseData.title);
      expect(response.body.course.description).toBe(courseData.description);
      expect(response.body.course.instructorId).toBe(instructorId);
      expect(response.body.course.isPublished).toBe(false);
    });

    test('POST /api/courses should reject invalid instructor', async () => {
      const courseData = {
        title: 'Invalid Course',
        description: 'This should fail',
        instructorId: 99999
      };

      const response = await request(app)
        .post('/api/courses')
        .send(courseData)
        .expect(400);

      expect(response.body.error).toBe('Invalid instructor ID');
    });

    test('POST /api/courses should reject missing required fields', async () => {
      const courseData = {
        title: '',
        description: '',
        instructorId: instructorId  // Use valid instructor but empty title/description
      };

      const response = await request(app)
        .post('/api/courses')
        .send(courseData)
        .expect(400);

      // This will hit the Course constructor validation
      expect(response.body.error).toContain('Title, description, and instructor ID are required');
    });

    test('GET /api/courses should return all courses', async () => {
      // Create a course first
      await request(app)
        .post('/api/courses')
        .send({
          title: 'Test Course for List',
          description: 'Course for testing list endpoint',
          instructorId: instructorId
        });

      const response = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(response.body.courses).toBeDefined();
      expect(response.body.total).toBeGreaterThan(0);
      expect(Array.isArray(response.body.courses)).toBe(true);
    });

    test('PUT /api/courses/:id/publish should publish a course', async () => {
      // Create a course first
      const createResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'Course to Publish',
          description: 'This course will be published',
          instructorId: instructorId
        });

      const courseId = createResponse.body.course.id;

      const response = await request(app)
        .put(`/api/courses/${courseId}/publish`)
        .expect(200);

      expect(response.body.message).toBe('Course published successfully');
      expect(response.body.course.isPublished).toBe(true);
    });
  });

  describe('Course Enrollment', () => {
    let studentId, instructorId, courseId;

    beforeEach(async () => {
      // Create student
      const studentResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Test Student',
          email: `student${Date.now()}@example.com`,
          role: 'student'
        });
      studentId = studentResponse.body.user.id;

      // Create instructor
      const instructorResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Test Instructor',
          email: `instructor${Date.now()}@example.com`,
          role: 'instructor'
        });
      instructorId = instructorResponse.body.user.id;

      // Create and publish course
      const courseResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'Enrollment Test Course',
          description: 'Course for testing enrollment',
          instructorId: instructorId
        });
      courseId = courseResponse.body.course.id;

      // Publish the course
      await request(app)
        .put(`/api/courses/${courseId}/publish`);
    });

    test('POST /api/courses/:id/enroll should enroll student successfully', async () => {
      const response = await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .send({ studentId: studentId })
        .expect(200);

      expect(response.body.message).toBe('Student enrolled successfully');
      expect(response.body.enrollmentCount).toBe(1);
    });

    test('POST /api/courses/:id/enroll should reject enrollment in unpublished course', async () => {
      // Create unpublished course
      const unpublishedResponse = await request(app)
        .post('/api/courses')
        .send({
          title: 'Unpublished Course',
          description: 'This course is not published',
          instructorId: instructorId
        });

      const unpublishedCourseId = unpublishedResponse.body.course.id;

      const response = await request(app)
        .post(`/api/courses/${unpublishedCourseId}/enroll`)
        .send({ studentId: studentId })
        .expect(400);

      expect(response.body.error).toBe('Course is not published');
    });

    test('POST /api/courses/:id/enroll should reject non-existent student', async () => {
      const response = await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .send({ studentId: 99999 })
        .expect(404);

      expect(response.body.error).toBe('Student not found');
    });

    test('POST /api/courses/:id/enroll should reject non-existent course', async () => {
      const response = await request(app)
        .post('/api/courses/99999/enroll')
        .send({ studentId: studentId })
        .expect(404);

      expect(response.body.error).toBe('Course not found');
    });
  });
});
