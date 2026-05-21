import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JobCard from '../components/JobCard'
import API from '../services/api'

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadSavedJobs = async () => {
    try {
      const response = await API.get('/saved-jobs')
      setSavedJobs(response.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedJobs()
  }, [])

  const savedIds = useMemo(() => new Set(savedJobs.map((job) => job._id || job.id)), [savedJobs])

  const handleToggleSave = async (job) => {
    const jobId = job._id || job.id
    const response = await API.delete(`/saved-jobs/${jobId}`)
    setSavedJobs(response.data.savedJobs)
  }

  if (loading) return <div className="container"><div className="card">Loading saved jobs...</div></div>

  return (
    <div className="container">
      <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
      <h2>Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        savedJobs.map((job) => <JobCard key={job._id || job.id} job={job} isSaved={savedIds.has(job._id)} onToggleSave={handleToggleSave} />)
      ) : (
        <div className="card">
          <p>No saved jobs yet. Browse jobs and click “Save Job”.</p>
          <button className="btn-primary" onClick={() => navigate('/jobs')}>Browse Jobs</button>
        </div>
      )}
    </div>
  )
}