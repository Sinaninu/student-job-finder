import React, { useEffect, useMemo, useState } from 'react'
import JobCard from '../components/JobCard'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Jobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    category: '',
    industry: '',
    major: '',
  })

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await API.get('/jobs', { params: filters })
      setJobs(response.data)
    } catch (err) {
      setError('Could not load jobs from the backend.')
    } finally {
      setLoading(false)
    }
  }

  const loadSavedJobs = async () => {
    if (user?.role !== 'student') {
      setSavedJobs([])
      return
    }
    const response = await API.get('/saved-jobs')
    setSavedJobs(response.data)
  }

  useEffect(() => {
    loadJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadSavedJobs().catch(() => setSavedJobs([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  const savedIds = useMemo(() => new Set(savedJobs.map((job) => job._id || job.id)), [savedJobs])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadJobs()
  }

  const handleToggleSave = async (job) => {
    const jobId = job._id || job.id
    if (savedIds.has(jobId)) {
      const response = await API.delete(`/saved-jobs/${jobId}`)
      setSavedJobs(response.data.savedJobs)
    } else {
      const response = await API.post(`/saved-jobs/${jobId}`)
      setSavedJobs(response.data.savedJobs)
    }
  }

  return (
    <div className="container">
      <h2>Browse Jobs</h2>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input type="text" name="keyword" placeholder="Keyword" value={filters.keyword} onChange={handleFilterChange} className="filter-input" />
        <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} className="filter-input" />
        <select name="jobType" value={filters.jobType} onChange={handleFilterChange} className="filter-select">
          <option value="">All Job Types</option>
          <option value="Internship">Internship</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
        </select>
        <input type="text" name="industry" placeholder="Industry" value={filters.industry} onChange={handleFilterChange} className="filter-input" />
        <input type="text" name="major" placeholder="Required major" value={filters.major} onChange={handleFilterChange} className="filter-input" />
        <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
          <option value="">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Data">Data</option>
          <option value="Product">Product</option>
          <option value="Marketing">Marketing</option>
          <option value="Business">Business</option>
        </select>
        <button className="btn-primary" type="submit">Search</button>
      </form>

      {loading && <div className="card">Loading jobs...</div>}
      {error && <div className="card">{error}</div>}

      {!loading && !error && (
        <>
          <p className="job-count">Found {jobs.length} jobs</p>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job._id} job={job} isSaved={savedIds.has(job._id)} onToggleSave={handleToggleSave} />
            ))
          ) : (
            <div className="card">No jobs found. Try changing the filters.</div>
          )}
        </>
      )}
    </div>
  )
}