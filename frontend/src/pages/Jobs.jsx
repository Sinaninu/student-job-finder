import React from 'react'
import JobCard from '../components/JobCard'

export default function Jobs() {
  const jobs = [
    { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Remote', salary: '$120k' },
    { id: 2, title: 'Backend Engineer', company: 'Amazon', location: 'Seattle, WA', salary: '$135k' },
    { id: 3, title: 'UI/UX Designer', company: 'Microsoft', location: 'Redmond, WA', salary: '$110k' }
  ]

  return (
    <div className="container">
      <h2>Browse Jobs</h2>
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  )
}