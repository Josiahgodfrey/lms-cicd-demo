import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock axios to avoid making real API calls during tests
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: {
        status: 'healthy',
        version: '1.0.0',
        uptime: 100,
        timestamp: new Date().toISOString(),
        users: [],
        courses: [],
        total: 0
      }
    })),
    post: vi.fn(() => Promise.resolve({
      data: {
        message: 'User created successfully',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'student',
          createdAt: new Date().toISOString()
        }
      }
    }))
  }
}))

describe('App Component', () => {
  it('renders the LMS application', () => {
    render(
     <App />
    )
    
    // Check if the navigation is rendered
    expect(screen.getByText(/LMS Dashboard/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <App />
    )
    
    // Check if navigation links are present
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
  })

  it('renders footer information', () => {
    render(
      <App />
    )
    
    // Check if footer is rendered
    expect(screen.getByText(/Learning Management System/i)).toBeInTheDocument()
    expect(screen.getByText(/Health Check/i)).toBeInTheDocument()
  })
})

describe('Dashboard Component', () => {
  it('shows loading state initially', () => {
    render(<App />);
    // Check for loading message
    expect(screen.getByText(/Loading LMS Data/i)).toBeInTheDocument();
  });
});
    
    // Check for loading message
    expect(screen.getByText(/Loading LMS Data/i)).toBeInTheDocument()
  })
})

describe('User Management Component', () => {
  it('renders user creation form when navigating to /users', () => {
    render(<App />);
    // Check if user management page elements are present
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New User/i)).toBeInTheDocument();
  });
});
