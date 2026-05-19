import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import JobCard from '../components/JobCard'

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('savedJobs')
    if (stored) setSavedJobs(JSON.parse(stored))
  }, [])

  // Listen for storage changes (if saved status changes elsewhere)
  const handleStorageChange = () => {
    const updated = localStorage.getItem('savedJobs')
    setSavedJobs(updated ? JSON.parse(updated) : [])
  }

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className="container">
      <h2>Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        savedJobs.map(job => <JobCard key={job._id || job.id} job={job} />)
      ) : (
        <div className="card">
          <p>No saved jobs yet. Browse jobs and click "☆ Save Job".</p>
          <button className="btn-primary" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  )
}