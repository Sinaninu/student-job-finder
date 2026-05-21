import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyMessage, setApplyMessage] = useState('')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await API.get(`/jobs/${id}`)
        setJob(response.data)
      } catch (error) {
        setError('Could not load job details.')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async () => {
    if (!user) {
      navigate('/login?role=student')
      return
    }

    if (user.role !== 'student') {
      setApplyMessage('Only students can apply for jobs.')
      return
    }

    try {
      setApplyMessage('')
      await API.post('/applications', {
        jobId: id,
        message: 'I am interested in this position.',
      })
      setApplyMessage('Application submitted successfully.')
    } catch (error) {
      setApplyMessage(error.response?.data?.message || 'Could not submit application.')
    }
  }

  if (loading) return <p className="container">Loading job details...</p>
  if (error) return <p className="container">{error}</p>
  if (!job) return <p className="container">Job not found.</p>

  const companyName = job.companyId?.companyProfile?.companyName || job.companyId?.name || 'Unknown company'

  return (
    <div className="job-details-page">
      <div className="job-details-card">
        <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
        <h1>{job.title}</h1>
        <p className="job-description">{job.description}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Job type:</strong> {job.jobType}</p>
        <p><strong>Category:</strong> {job.category}</p>
        <p><strong>Industry:</strong> {job.industry || 'Not specified'}</p>
        <p><strong>Required majors:</strong> {job.majorTags?.length ? job.majorTags.join(', ') : 'Any'}</p>
        <p><strong>Company:</strong> {companyName}</p>
        {job.requirements && <p><strong>Requirements:</strong> {job.requirements}</p>}

        <div className="job-details-actions">
          {user?.role !== 'company' && user?.role !== 'admin' && (
            <button className="btn-primary" onClick={handleApply}>Apply Now</button>
          )}
          {user?.role === 'company' && <p className="muted">Company accounts cannot apply for jobs.</p>}
        </div>

        {applyMessage && <p className="apply-message">{applyMessage}</p>}
      </div>
    </div>
  )
}