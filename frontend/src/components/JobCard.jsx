import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function JobCard({ job, isSaved = false, onToggleSave }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const jobId = job._id || job.id
  const companyName =
    job.companyId?.companyProfile?.companyName ||
    job.companyId?.name ||
    'Company'

  const salary =
    job.salaryMin || job.salaryMax
      ? `${job.salaryMin || '0'} - ${job.salaryMax || 'Open'}`
      : 'Salary not listed'

  return (
    <div className="card job-card">
      <div className="section-header">
        <div>
          <h3>{job.title}</h3>
          <p>
            <strong>{companyName}</strong>
          </p>
        </div>

        {job.jobType && <span className="meta-pill">{job.jobType}</span>}
      </div>

      <div className="job-card-meta">
        {job.location && <span className="meta-pill">📍 {job.location}</span>}
        {job.category && <span className="meta-pill">{job.category}</span>}
        {job.industry && <span className="meta-pill">{job.industry}</span>}
        <span className="meta-pill">{salary}</span>
      </div>

      {job.majorTags?.length > 0 && (
        <p>
          <strong>Majors:</strong> {job.majorTags.join(', ')}
        </p>
      )}

      {job.description && <p>{job.description}</p>}

      <div className="job-card-buttons">
        <button
          className="btn-primary"
          onClick={() => navigate(`/jobs/${jobId}`)}
        >
          View Details
        </button>

        {user?.role === 'student' && (
          <button
            className={isSaved ? 'btn-saved' : 'btn-outline'}
            onClick={() => onToggleSave?.(job)}
          >
            {isSaved ? '★ Remove Saved' : '☆ Save Job'}
          </button>
        )}
      </div>
    </div>
  )
}