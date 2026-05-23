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

    try {
      const response = await API.get('/saved-jobs')
      setSavedJobs(response.data)
    } catch (err) {
      setSavedJobs([])
    }
  }

  useEffect(() => {
    loadJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadSavedJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  const savedIds = useMemo(
    () => new Set(savedJobs.map((job) => job._id || job.id)),
    [savedJobs]
  )

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadJobs()
  }

  const handleReset = () => {
    setFilters({
      keyword: '',
      location: '',
      jobType: '',
      category: '',
      industry: '',
      major: '',
    })
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
    <main className="jobs-page">
      <section className="jobs-hero">
        <p className="eyebrow">Find opportunities</p>
        <h1>Browse Jobs</h1>
        <p>
          Search internships, part-time roles, and entry-level jobs that match
          your study background.
        </p>
      </section>

      <section className="jobs-panel">
        <form className="filter-bar" onSubmit={handleSearch}>
          <div className="filter-group">
            <label>Keyword</label>
            <input
              type="text"
              name="keyword"
              placeholder="e.g. Developer"
              value={filters.keyword}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Stockholm"
              value={filters.location}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Job type</label>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Job Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="e.g. Software"
              value={filters.industry}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Major</label>
            <input
              type="text"
              name="major"
              placeholder="e.g. Computer Science"
              value={filters.major}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Data">Data</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn-primary" type="submit">
              Search
            </button>

            <button className="btn-outline" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="jobs-results">
        {loading && <div className="card">Loading jobs...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <>
            <div className="jobs-results-header">
              <div>
                <h2>Available jobs</h2>
                <p>Found {jobs.length} jobs</p>
              </div>
            </div>

            {jobs.length > 0 ? (
              <div className="jobs-list">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedIds.has(job._id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="card empty-state">
                No jobs found. Try changing the filters.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}