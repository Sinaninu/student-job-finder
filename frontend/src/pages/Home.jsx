import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user) {
    const dashboardPath =
      user.role === 'company'
        ? '/company/dashboard'
        : user.role === 'admin'
          ? '/admin'
          : '/student/dashboard'

    return <Navigate to={dashboardPath} replace />
  }

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>
          Find the Right Job
          <br />
          for Your Future
        </h1>

        <p>Discover part-time and entry-level jobs all in one place.</p>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate('/login?role=student')}
          >
            I'm a Student
          </button>

          <button
            className="btn-outline"
            onClick={() => navigate('/login?role=company')}
          >
            I'm a Company
          </button>
        </div>
      </div>
    </div>
  )
}