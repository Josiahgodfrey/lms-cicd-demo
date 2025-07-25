import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import './App.css'

interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

interface Course {
  id: number
  title: string
  description: string
  instructorName: string
  enrolledStudents: number
  maxStudents: number
  isPublished: boolean
  createdAt: string
}

interface HealthStatus {
  status: string
  timestamp: string
  version: string
  uptime: number
}

function Dashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [healthRes, usersRes, coursesRes] = await Promise.all([
        axios.get('/health'),
        axios.get('/api/users'),
        axios.get('/api/courses')
      ])
      
      setHealth(healthRes.data)
      setUsers(usersRes.data.users)
      setCourses(coursesRes.data.courses)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <h2>🔄 Loading LMS Data...</h2>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1>🎓 Learning Management System</h1>
      
      {/* Health Status */}
      <div className="health-status">
        <h2>📊 System Status</h2>
        {health && (
          <div className={`status ${health.status}`}>
            <p><strong>Status:</strong> {health.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}</p>
            <p><strong>Version:</strong> {health.version}</p>
            <p><strong>Uptime:</strong> {health.uptime} seconds</p>
            <p><strong>Last Check:</strong> {new Date(health.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="stat-card">
          <h3>👥 Total Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>📚 Total Courses</h3>
          <p className="stat-number">{courses.length}</p>
        </div>
        <div className="stat-card">
          <h3>👨‍🏫 Instructors</h3>
          <p className="stat-number">{users.filter(u => u.role === 'instructor').length}</p>
        </div>
        <div className="stat-card">
          <h3>👨‍🎓 Students</h3>
          <p className="stat-number">{users.filter(u => u.role === 'student').length}</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="section">
        <h2>👥 Recent Users</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(-5).map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role ${user.role}`}>
                      {user.role === 'instructor' ? '👨‍🏫' : user.role === 'admin' ? '👑' : '👨‍🎓'} 
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="empty-state">No users found. Create some users to see them here!</p>
          )}
        </div>
      </div>

      {/* Courses */}
      <div className="section">
        <h2>📚 Courses</h2>
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <p><strong>Instructor:</strong> {course.instructorName}</p>
                <p><strong>Students:</strong> {course.enrolledStudents}/{course.maxStudents}</p>
                <p><strong>Status:</strong> 
                  <span className={`status ${course.isPublished ? 'published' : 'draft'}`}>
                    {course.isPublished ? '✅ Published' : '📝 Draft'}
                  </span>
                </p>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="empty-state">No courses available. Create some courses to see them here!</p>
          )}
        </div>
      </div>

      <div className="refresh-section">
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </div>
    </div>
  )
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await axios.post('/api/users', formData)
      setMessage('✅ User created successfully!')
      setFormData({ name: '', email: '', role: 'student' })
      fetchUsers()
    } catch (error: any) {
      setMessage(`❌ Error: ${error.response?.data?.error || 'Failed to create user'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="user-management">
      <h1>👥 User Management</h1>
      
      <div className="form-section">
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter full name"
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="Enter email address"
            />
          </div>
          
          <div className="form-group">
            <label>Role:</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">👨‍🎓 Student</option>
              <option value="instructor">👨‍🏫 Instructor</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Creating...' : '➕ Create User'}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="users-list">
        <h2>All Users ({users.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role ${user.role}`}>
                      {user.role === 'instructor' ? '👨‍🏫' : user.role === 'admin' ? '👑' : '👨‍🎓'} 
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">🎓 LMS Dashboard</Link>
          </div>
          <div className="nav-links">
            <Link to="/">📊 Dashboard</Link>
            <Link to="/users">👥 Users</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <p>🎓 Learning Management System - Built with React + TypeScript + Vite</p>
          <p>Backend API: <a href="/health" target="_blank">Health Check</a></p>
        </footer>
      </div>
    </Router>
  )
}

export default App
