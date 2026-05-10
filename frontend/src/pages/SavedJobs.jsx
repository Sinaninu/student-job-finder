import React, { useState, useEffect } from 'react'
import JobCard from '../components/JobCard'

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([])

  useEffect(() => {
    // Load saved jobs from localStorage
    const stored = localStorage.getItem('savedJobs')
    if (stored) {
      setSavedJobs(JSON.parse(stored))
    }
  }, [])

  const removeSavedJob = (jobId) => {
    const updated = savedJobs.filter(job => job.id !== jobId)
    setSavedJobs(updated)
    localStorage.setItem('savedJobs', JSON.stringify(updated))
  }

  return (
    <div className="container">
      <h2>Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        savedJobs.map(job => (
          <div key={job.id} className="saved-job-card">
            <JobCard job={job} />
            <button 
              className="btn-outline remove-btn"
              onClick={() => removeSavedJob(job.id)}
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <div className="card">
          <p>No saved jobs yet. Browse jobs and click "Save Job" to add them here.</p>
          <button className="btn-primary" onClick={() => window.location.href = '/jobs'}>
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  )
}