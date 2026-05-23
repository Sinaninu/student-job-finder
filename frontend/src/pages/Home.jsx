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
    <main className="hero">
      <section className="hero-content">
        <p className="eyebrow">Student Job Finder</p>

        <h1>Find the right job for your future</h1>

        <p>
          A clean recruitment platform where students discover part-time jobs
          and companies manage applications in one place.
        </p>

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

          <button
            className="btn-outline"
            onClick={() => navigate('/jobs')}
          >
            Browse Jobs
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>Fast</strong>
            <span>Search and apply quickly</span>
          </div>

          <div className="hero-stat">
            <strong>Secure</strong>
            <span>Role-based access</span>
          </div>

          <div className="hero-stat">
            <strong>Simple</strong>
            <span>Clean dashboards</span>
          </div>
        </div>
      </section>
    </main>
  )
}