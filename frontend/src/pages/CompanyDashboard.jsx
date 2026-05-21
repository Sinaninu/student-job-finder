import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function CompanyDashboard() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [jobsResponse, appsResponse] = await Promise.all([
        API.get('/jobs/company/my-jobs'),
        API.get('/applications/company'),
      ])
      setJobs(jobsResponse.data)
      setApplications(appsResponse.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const appsByJob = useMemo(() => {
    return applications.reduce((acc, app) => {
      const jobId = app.jobId?._id || app.jobId
      acc[jobId] = acc[jobId] || []
      acc[jobId].push(app)
      return acc
    }, {})
  }, [applications])

  const updateStatus = async (applicationId, status) => {
    await API.patch(`/applications/${applicationId}/status`, { status })
    loadData()
  }

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return
    await API.delete(`/jobs/${jobId}`)
    loadData()
  }

  if (loading) return <div className="container"><div className="card">Loading recruiter dashboard...</div></div>

  return (
    <div className="container">
      <div className="dashboard-hero">
        <div>
          <h2>Recruiter Dashboard</h2>
          <p className="dashboard-intro">Manage job posts, review applicants, and access candidate CVs.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/company/jobs/new')}>Post New Job</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card"><h3>Active Jobs</h3><p className="stat-number">{jobs.length}</p></div>
        <div className="stat-card"><h3>Total Applicants</h3><p className="stat-number">{applications.length}</p></div>
        <div className="stat-card"><h3>Reviewed</h3><p className="stat-number">{applications.filter((a) => a.status === 'reviewed').length}</p></div>
      </div>

      <div className="admin-section">
        <h2>Applicant Management</h2>
        {jobs.length === 0 ? (
          <div className="card">You have not posted any jobs yet.</div>
        ) : (
          jobs.map((job) => (
            <div className="card" key={job._id}>
              <div className="section-header">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.location} • {job.jobType} • {job.category} • Views: {job.views || 0}</p>
                  <p>Applicants: {appsByJob[job._id]?.length || 0}</p>
                </div>
                <button className="btn-delete" onClick={() => deleteJob(job._id)}>Delete Job</button>
              </div>

              {appsByJob[job._id]?.length ? (
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Email</th>
                        <th>CV</th>
                        <th>Status</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appsByJob[job._id].map((app) => {
                        const resumeUrl = app.studentId?.resume?.url
                        const email = app.studentId?.email
                        const template = `mailto:${email}?subject=Interview invitation for ${encodeURIComponent(job.title)}&body=Hello ${encodeURIComponent(app.studentId?.name || '')},%0D%0A%0D%0AWe reviewed your application for ${encodeURIComponent(job.title)} and would like to schedule an interview.%0D%0A%0D%0AThanks.`
                        return (
                          <tr key={app._id}>
                            <td>{app.studentId?.name}</td>
                            <td>{email}</td>
                            <td>
                              {resumeUrl ? (
                                <a href={`http://localhost:5000${resumeUrl}`} target="_blank" rel="noreferrer">View / Download CV</a>
                              ) : 'No CV uploaded'}
                            </td>
                            <td>
                              <select value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)}>
                                <option value="submitted">Submitted</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="closed">Closed</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                            <td><a href={template}>Message</a></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No applicants yet.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
