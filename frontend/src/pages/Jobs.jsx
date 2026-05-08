import React, { useState } from 'react'
import JobCard from '../components/JobCard'

export default function Jobs() {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    category: ''
  })

  const allJobs = [
    { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Remote', jobType: 'Full-time', category: 'Engineering', salary: '$120k' },
    { id: 2, title: 'Backend Engineer', company: 'Amazon', location: 'Seattle, WA', jobType: 'Full-time', category: 'Engineering', salary: '$135k' },
    { id: 3, title: 'UI/UX Designer', company: 'Microsoft', location: 'Redmond, WA', jobType: 'Part-time', category: 'Design', salary: '$110k' },
    { id: 4, title: 'Data Analyst', company: 'Meta', location: 'Remote', jobType: 'Contract', category: 'Data', salary: '$95k' },
    { id: 5, title: 'Product Manager', company: 'Netflix', location: 'Los Gatos, CA', jobType: 'Full-time', category: 'Product', salary: '$150k' }
  ]

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const filteredJobs = allJobs.filter(job => {
    const matchesKeyword = job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                            job.company.toLowerCase().includes(filters.keyword.toLowerCase())
    const matchesLocation = filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase())
    const matchesJobType = filters.jobType === '' || job.jobType === filters.jobType
    const matchesCategory = filters.category === '' || job.category.toLowerCase() === filters.category.toLowerCase()
    return matchesKeyword && matchesLocation && matchesJobType && matchesCategory
  })

  return (
    <div className="container">
      <h2>Browse Jobs</h2>

      <div className="filter-bar">
        <input
          type="text"
          name="keyword"
          placeholder="Keyword (title or company)"
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
        <select name="jobType" value={filters.jobType} onChange={handleFilterChange} className="filter-select">
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
          <option value="">All Categories</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="data">Data</option>
          <option value="product">Product</option>
        </select>
      </div>

      <p className="job-count">Found {filteredJobs.length} jobs</p>

      {filteredJobs.length > 0 ? (
        filteredJobs.map(job => <JobCard key={job.id} job={job} />)
      ) : (
        <div className="card">No jobs match your filters. Try adjusting them.</div>
      )}
    </div>
  )
}