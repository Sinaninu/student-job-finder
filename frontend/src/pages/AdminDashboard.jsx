import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

const applicationStatuses = ['submitted', 'reviewed', 'accepted', 'rejected', 'closed']

const formatDate = (value) => {
  if (!value) return 'Not available'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getCompanyName = (job) => {
  return job?.companyId?.companyProfile?.companyName || job?.companyId?.name || 'Unknown company'
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadAdminData = async () => {
    setLoading(true)
    setError('')
    setStatusMessage('')

    try {
      const [statsRes, jobsRes, applicationsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/jobs'),
        API.get('/admin/applications'),
        API.get('/admin/users'),
      ])

      setStats(statsRes.data)
      setJobs(jobsRes.data)
      setApplications(applicationsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load admin dashboard data. Make sure backend is running and you are logged in as admin.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const filteredJobs = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return jobs

    return jobs.filter((job) => {
      return [job.title, job.location, job.jobType, job.category, getCompanyName(job)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    })
  }, [jobs, search])

  const filteredApplications = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return applications

    return applications.filter((application) => {
      return [
        application.studentId?.name,
        application.studentId?.email,
        application.jobId?.title,
        application.companyId?.companyProfile?.companyName,
        application.companyId?.name,
        application.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    })
  }, [applications, search])

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return users

    return users.filter((account) => {
      return [account.name, account.email, account.role, account.companyProfile?.companyName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    })
  }, [users, search])

  const deleteJob = async (jobId) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?')
    if (!confirmed) return

    setError('')
    setStatusMessage('')

    try {
      await API.delete(`/jobs/${jobId}`)

      setJobs((currentJobs) => currentJobs.filter((job) => job._id !== jobId))
      setStatusMessage('Job deleted successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete job.')
    }
  }

  const deleteApplication = async (applicationId) => {
    const confirmed = window.confirm('Are you sure you want to delete this application?')
    if (!confirmed) return

    setError('')
    setStatusMessage('')

    try {
      await API.delete(`/admin/applications/${applicationId}`)

      setApplications((currentApplications) =>
        currentApplications.filter((application) => application._id !== applicationId)
      )

      setStatusMessage('Application deleted successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete application.')
    }
  }

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This may also delete related jobs or applications.'
    )

    if (!confirmed) return

    setError('')
    setStatusMessage('')

    try {
      await API.delete(`/admin/users/${userId}`)

      setUsers((currentUsers) => currentUsers.filter((account) => account._id !== userId))

      setStatusMessage('User deleted successfully.')
      loadAdminData()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete user.')
    }
  }

  const updateApplicationStatus = async (applicationId, status) => {
    setError('')
    setStatusMessage('')

    try {
      const response = await API.patch(`/applications/${applicationId}/status`, { status })

      setApplications((currentApplications) =>
        currentApplications.map((application) => {
          if (application._id !== applicationId) return application
          return { ...application, status: response.data.application.status }
        })
      )

      setStatusMessage('Application status updated.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update application status.')
    }
  }

  const statCards = [
    {
      label: 'Total users',
      value: stats?.totalUsers ?? 0,
      hint: `${stats?.totalStudents ?? 0} students, ${stats?.totalCompanies ?? 0} companies`,
    },
    {
      label: 'Total jobs',
      value: stats?.totalJobs ?? 0,
      hint: `${stats?.activeJobs ?? 0} active, ${stats?.inactiveJobs ?? 0} inactive`,
    },
    {
      label: 'Applications',
      value: stats?.totalApplications ?? 0,
      hint: `${stats?.pendingApplications ?? 0} waiting for review`,
    },
    {
      label: 'Active listings',
      value: stats?.activeJobs ?? 0,
      hint: 'Visible on public jobs page',
    },
  ]

  return (
    <main className="admin-dashboard page-shell">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Admin area</p>
          <h1>Admin Dashboard</h1>
          <p className="admin-hero-text">
            Welcome, {user?.name || user?.email}. Manage users, job posts, and applications from one
            secure place.
          </p>
        </div>

        <div className="admin-hero-actions">
          <button className="btn-outline" onClick={loadAdminData}>
            Refresh data
          </button>
          <Link className="btn-outline" to="/jobs">
            View public jobs
          </Link>
        </div>
      </section>

      {error && <p className="error-message">{error}</p>}
      {statusMessage && <p className="success-message">{statusMessage}</p>}

      {loading ? (
        <div className="admin-loading card">Loading admin dashboard...</div>
      ) : (
        <>
          <section className="admin-stats-grid">
            {statCards.map((card) => (
              <article className="admin-stat-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.hint}</p>
              </article>
            ))}
          </section>

          <section className="admin-panel">
            <div className="admin-toolbar">
              <div className="admin-tabs" aria-label="Admin dashboard sections">
                <button
                  className={activeTab === 'overview' ? 'active' : ''}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={activeTab === 'jobs' ? 'active' : ''}
                  onClick={() => setActiveTab('jobs')}
                >
                  Jobs
                </button>
                <button
                  className={activeTab === 'applications' ? 'active' : ''}
                  onClick={() => setActiveTab('applications')}
                >
                  Applications
                </button>
                <button
                  className={activeTab === 'users' ? 'active' : ''}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
              </div>

              <input
                className="admin-search"
                type="search"
                placeholder="Search dashboard..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {activeTab === 'overview' && (
              <div className="admin-overview-grid">
                <div className="admin-card">
                  <h2>Recent jobs</h2>
                  <div className="compact-list">
                    {jobs.slice(0, 5).map((job) => (
                      <div className="compact-row" key={job._id}>
                        <div>
                          <strong>{job.title}</strong>
                          <span>
                            {getCompanyName(job)} • {job.location}
                          </span>
                        </div>
                        <span className={`status-pill ${job.isActive ? 'active' : 'closed'}`}>
                          {job.isActive ? 'active' : 'inactive'}
                        </span>
                      </div>
                    ))}

                    {jobs.length === 0 && <p className="muted">No jobs found yet.</p>}
                  </div>
                </div>

                <div className="admin-card">
                  <h2>Recent applications</h2>
                  <div className="compact-list">
                    {applications.slice(0, 5).map((application) => (
                      <div className="compact-row" key={application._id}>
                        <div>
                          <strong>{application.studentId?.name || 'Unknown student'}</strong>
                          <span>
                            {application.jobId?.title || 'Unknown job'} •{' '}
                            {formatDate(application.createdAt)}
                          </span>
                        </div>
                        <span className={`status-pill ${application.status}`}>
                          {application.status}
                        </span>
                      </div>
                    ))}

                    {applications.length === 0 && (
                      <p className="muted">No applications found yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="admin-card">
                <div className="section-header">
                  <div>
                    <h2>Manage jobs</h2>
                    <p className="muted">
                      Admin can review and delete job posts. Company users can still manage their own
                      jobs.
                    </p>
                  </div>
                  <Link className="btn-primary" to="/company/jobs/new">
                    Post job
                  </Link>
                </div>

                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Applicants</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job._id}>
                          <td>
                            <strong>{job.title}</strong>
                            <small>
                              {job.jobType} • {job.category}
                            </small>
                          </td>
                          <td>{getCompanyName(job)}</td>
                          <td>{job.location}</td>
                          <td>{job.applicantsCount ?? 0}</td>
                          <td>
                            <span className={`status-pill ${job.isActive ? 'active' : 'closed'}`}>
                              {job.isActive ? 'active' : 'inactive'}
                            </span>
                          </td>
                          <td className="table-actions">
                            <Link className="btn-small" to={`/jobs/${job._id}`}>
                              View
                            </Link>
                            <button
                              type="button"
                              className="btn-delete btn-small"
                              onClick={() => deleteJob(job._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredJobs.length === 0 && (
                    <p className="empty-state">No jobs match your search.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="admin-card">
                <h2>Manage applications</h2>

                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Job</th>
                        <th>Company</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map((application) => (
                        <tr key={application._id}>
                          <td>
                            <strong>{application.studentId?.name || 'Unknown student'}</strong>
                            <small>{application.studentId?.email}</small>
                          </td>
                          <td>{application.jobId?.title || 'Unknown job'}</td>
                          <td>
                            {application.companyId?.companyProfile?.companyName ||
                              application.companyId?.name ||
                              'Unknown company'}
                          </td>
                          <td>{formatDate(application.createdAt)}</td>
                          <td>
                            <select
                              value={application.status}
                              onChange={(e) =>
                                updateApplicationStatus(application._id, e.target.value)
                              }
                            >
                              {applicationStatuses.map((status) => (
                                <option value={status} key={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="table-actions">
                            <button
                              type="button"
                              className="btn-delete btn-small"
                              onClick={() => deleteApplication(application._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredApplications.length === 0 && (
                    <p className="empty-state">No applications match your search.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="admin-card">
                <h2>Users</h2>

                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((account) => (
                        <tr key={account._id}>
                          <td>
                            <strong>{account.companyProfile?.companyName || account.name}</strong>
                            {account.companyProfile?.companyName && (
                              <small>Contact: {account.name}</small>
                            )}
                          </td>
                          <td>{account.email}</td>
                          <td>
                            <span className={`role-chip ${account.role}`}>{account.role}</span>
                          </td>
                          <td>{formatDate(account.createdAt)}</td>
                          <td className="table-actions">
                            {account.role === 'admin' ? (
                              <span className="admin-protected-text">Protected</span>
                            ) : (
                              <button
                                type="button"
                                className="btn-delete btn-small"
                                onClick={() => deleteUser(account._id)}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <p className="empty-state">No users match your search.</p>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}