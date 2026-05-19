
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard(){
  const { user } = useAuth()
  const navigate = useNavigate()

  return(
    <div className='container'>
      <div className='dashboard-hero'>
        <div>
          <h2>Welcome back, {user?.name || user?.email}</h2>
          <p className='dashboard-intro'>
            {user?.role === 'admin'
              ? 'You are viewing the admin dashboard. Manage jobs and review applications here.'
              : 'Find jobs, save your favorites, and track your applications from one dashboard.'}
          </p>
        </div>
      </div>

      <div className='dashboard-grid'>
        <button className='card dashboard-card' onClick={() => navigate('/jobs')}>
          <h3>Browse Jobs</h3>
          <p>Search available roles and explore opportunities.</p>
        </button>

        {user?.role !== 'admin' && (
          <button className='card dashboard-card' onClick={() => navigate('/saved-jobs')}>
            <h3>Saved Jobs</h3>
            <p>See the roles you bookmarked for later.</p>
          </button>
        )}

        <button className='card dashboard-card' onClick={() => navigate('/applications')}>
          <h3>My Applications</h3>
          <p>Track your submitted applications and review status updates.</p>
        </button>

        {user?.role === 'admin' && (
          <button className='card dashboard-card' onClick={() => navigate('/admin')}>
            <h3>Admin Controls</h3>
            <p>Manage jobs, applications and company listings.</p>
          </button>
        )}
      </div>
    </div>
  )
}
