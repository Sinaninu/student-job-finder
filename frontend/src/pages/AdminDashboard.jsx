import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Dev', company: 'Google', status: 'Active' },
    { id: 2, title: 'Backend Dev', company: 'Amazon', status: 'Active' }
  ])
  const [applications, setApplications] = useState([
    { id: 1, name: 'John Doe', job: 'Frontend Dev', status: 'Pending' },
    { id: 2, name: 'Jane Smith', job: 'Backend Dev', status: 'Reviewed' }
  ])

  const deleteJob = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId))
  }

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ))
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p className="stat-number">{jobs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{applications.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Reviews</h3>
          <p className="stat-number">{applications.filter(a => a.status === 'Pending').length}</p>
        </div>
      </div>

      {/* Manage Jobs */}
      <div className="admin-section">
        <h2>Manage Jobs</h2>
        <button className="btn-primary" onClick={() => alert('Open Add Job Modal')}>
          + Post New Job
        </button>
        <div className="admin-table">
          <table>
            <thead>
              <tr><th>Title</th><th>Company</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td><td>{job.company}</td><td>{job.status}</td>
                  <td>
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete" onClick={() => deleteJob(job.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Applications */}
      <div className="admin-section">
        <h2>Manage Applications</h2>
        <div className="admin-table">
          <table>
            <thead><tr><th>Applicant</th><th>Job</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.name}</td><td>{app.job}</td><td>{app.status}</td>
                  <td>
                    <select onChange={(e) => updateApplicationStatus(app.id, e.target.value)} value={app.status}>
                      <option>Pending</option><option>Reviewed</option><option>Rejected</option><option>Hired</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}