import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="dashboard-hero">
        <div>
          <h2>Welcome back, {user?.name || user?.email}</h2>
          <p className="dashboard-intro">Find jobs, save favorites, upload your CV, and track applications.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <button className="card dashboard-card" onClick={() => navigate('/jobs')}>
          <h3>Browse Jobs</h3>
          <p>Search available roles and explore opportunities.</p>
        </button>
        <button className="card dashboard-card" onClick={() => navigate('/saved-jobs')}>
          <h3>Saved Jobs</h3>
          <p>See bookmarked roles and remove ones you no longer want.</p>
        </button>
        <button className="card dashboard-card" onClick={() => navigate('/applications')}>
          <h3>My Applications</h3>
          <p>Track submitted applications and withdraw if needed.</p>
        </button>
        <button className="card dashboard-card" onClick={() => navigate('/profile')}>
          <h3>CV & Profile</h3>
          <p>Upload, preview, or delete your resume.</p>
        </button>
      </div>
    </div>
  )
}