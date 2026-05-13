import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function JobCard({ job }) {
  const navigate = useNavigate()

  return (
    <div className="card">
      <h3>{job.title}</h3>

      <p>
        <strong>{job.companyId?.name || 'Company'}</strong>
      </p>

      <p>
        {job.location} • {job.jobType} • {job.category}
      </p>

      <p>{job.description}</p>

      <button
        className="btn-primary"
        onClick={() => navigate(`/jobs/${job._id}`)}
      >
        View Details
      </button>
    </div>
  )
}