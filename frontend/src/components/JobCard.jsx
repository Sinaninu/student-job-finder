import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JobCard({ job }) {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    setIsSaved(savedJobs.some(j => j.id === job.id))
  }, [job.id])

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    if (!isSaved) {
      savedJobs.push(job)
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs))
      setIsSaved(true)
      alert('Job saved!')
    } else {
      const updated = savedJobs.filter(j => j.id !== job.id)
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      setIsSaved(false)
      alert('Job removed from saved!')
    }
  }

  return (
    <div className="card">
      <h3>{job.title}</h3>
      <p><strong>{job.company}</strong> • {job.location}</p>
      <p>{job.jobType} • {job.category} • {job.salary}</p>
      <div className="job-card-buttons">
        <button className="btn-primary" onClick={() => navigate(`/jobs/${job.id}`)}>
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