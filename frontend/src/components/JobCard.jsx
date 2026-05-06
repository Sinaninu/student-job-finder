import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function JobCard({ job }) {
  const navigate = useNavigate()
  return (
    <div className="card">
      <h3>{job.title}</h3>
      <p><strong>{job.company}</strong></p>
      <p>{job.location} • {job.salary}</p>
      <button className="btn-primary" onClick={() => navigate(`/jobs/${job.id}`)}>
        View Details
      </button>
    </div>
  )
}