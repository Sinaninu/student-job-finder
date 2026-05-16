import React, { useEffect, useState } from 'react'
import JobCard from '../components/JobCard'
import API from '../services/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    category: ''
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await API.get('/jobs')
        setJobs(response.data)
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
        setError('Could not load jobs from the backend.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const filteredJobs = jobs.filter(job => {
    const companyName = job.companyId?.name || ''

    const matchesKeyword =
      job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      companyName.toLowerCase().includes(filters.keyword.toLowerCase())

    const matchesLocation =
      filters.location === '' ||
      job.location.toLowerCase().includes(filters.location.toLowerCase())

    const matchesJobType =
      filters.jobType === '' ||
      job.jobType === filters.jobType

    const matchesCategory =
      filters.category === '' ||
      job.category.toLowerCase() === filters.category.toLowerCase()

    return matchesKeyword && matchesLocation && matchesJobType && matchesCategory
  })

  return (
    <div className="container">
      <h2>Browse Jobs</h2>

      <div className="filter-bar">
        <input
          type="text"
          name="keyword"
          placeholder="Keyword"
          value={filters.keyword}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>

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
        </select>
      </div>

      {loading && <div className="card">Loading jobs...</div>}

      {error && <div className="card">{error}</div>}

      {!loading && !error && (
        <>
          <p className="job-count">Found {filteredJobs.length} jobs</p>

          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="card">
              No jobs found. Try adding jobs from Postman or changing the filters.
            </div>
          )}
        </>
      )}
    </div>
  )
}