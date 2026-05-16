import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JobCard({ job }) {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const jobId = job._id || job.id

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    setIsSaved(savedJobs.some(j => (j._id || j.id) === jobId))
  }, [jobId])

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    if (!isSaved) {
      savedJobs.push(job)
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs))
      setIsSaved(true)
      alert('Job saved!')
    } else {
      const updated = savedJobs.filter(j => (j._id || j.id) !== jobId)
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      setIsSaved(false)
      alert('Job removed from saved!')
    }
  }

  return (
    <div className="card">
      <h3>{job.title}</h3>
      <p><strong>{job.companyId?.name || 'Company'}</strong></p>
      <p>{job.location} • {job.jobType} • {job.category}{job.salary ? ` • ${job.salary}` : ''}</p>
      {job.description && <p>{job.description}</p>}
      <div className="job-card-buttons">
        <button
          className="btn-primary"
          onClick={() => navigate(`/jobs/${jobId}`)}
        >
          View Details
        </button>
        <button 
          className={isSaved ? "btn-saved" : "btn-outline"}
          onClick={handleSaveJob}
        >
          {isSaved ? '★ Saved' : '☆ Save Job'}
        </button>
      </div>
    </div>
  )
}