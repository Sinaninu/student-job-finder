import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function JobCard({ job, isSaved = false, onToggleSave }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const jobId = job._id || job.id
  const companyName = job.companyId?.companyProfile?.companyName || job.companyId?.name || 'Company'

  return (
    <div className="card">
      <h3>{job.title}</h3>
      <p><strong>{companyName}</strong></p>
      <p>
        {job.location} • {job.jobType} • {job.category}
        {job.industry ? ` • ${job.industry}` : ''}
        {job.salaryMin || job.salaryMax ? ` • ${job.salaryMin || ''}-${job.salaryMax || ''}` : ''}
      </p>
      {job.majorTags?.length > 0 && <p><strong>Majors:</strong> {job.majorTags.join(', ')}</p>}
      {job.description && <p>{job.description}</p>}
      <div className="job-card-buttons">
        <button className="btn-primary" onClick={() => navigate(`/jobs/${jobId}`)}>
          View Details
        </button>

        {user?.role === 'student' && (
          <button className={isSaved ? 'btn-saved' : 'btn-outline'} onClick={() => onToggleSave?.(job)}>
            {isSaved ? '★ Remove Saved' : '☆ Save Job'}
          </button>
        )}
      </div>
    </div>
  )
}
