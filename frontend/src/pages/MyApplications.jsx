import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

const steps = ['submitted', 'reviewed', 'closed']

function ApplicationTimeline({ status }) {
  const normalized = status === 'accepted' || status === 'rejected' ? 'closed' : status
  const currentIndex = steps.indexOf(normalized)

  if (status === 'withdrawn') {
    return <p className="status-pill withdrawn">Withdrawn</p>
  }

  return (
    <div className="timeline">
      {steps.map((step, index) => (
        <span key={step} className={`timeline-step ${index <= currentIndex ? 'active' : ''}`}>
          {step}
        </span>
      ))}
    </div>
  )
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchApplications = async () => {
    try {
      const response = await API.get('/applications/my-applications')
      setApplications(response.data)
    } catch (error) {
      setError('Could not load applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return
    await API.delete(`/applications/${id}`)
    fetchApplications()
  }

  if (loading) return <p className="container">Loading applications...</p>
  if (error) return <p className="container">{error}</p>

  return (
    <div className="applications-page container">
      <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div className="application-card" key={application._id}>
              <h3>{application.jobId?.title}</h3>
              <p><strong>Company:</strong> {application.companyId?.companyProfile?.companyName || application.companyId?.name || 'Company'}</p>
              <p><strong>Location:</strong> {application.jobId?.location}</p>
              <p><strong>Job Type:</strong> {application.jobId?.jobType}</p>
              <p><strong>Status:</strong> {application.status}</p>
              <ApplicationTimeline status={application.status} />
              <p><strong>Message:</strong> {application.message}</p>
              <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
              {application.status !== 'withdrawn' && (
                <button className="btn-delete" onClick={() => withdraw(application._id)}>Withdraw Application</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}