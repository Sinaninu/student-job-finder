import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function JobForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    jobType: 'Internship',
    location: '',
    category: '',
    industry: '',
    majorTags: '',
    salaryMin: '',
    salaryMax: '',
    requirements: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/jobs', {
        ...form,
        majorTags: form.majorTags.split(',').map((x) => x.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      })
      navigate('/company/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container form-page">
      <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
      <h2>Job Posting Wizard</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="card form-grid" onSubmit={submit}>
        <input name="title" placeholder="Job title" value={form.title} onChange={update} required />
        <select name="jobType" value={form.jobType} onChange={update} required>
          <option value="Internship">Internship</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
        </select>
        <input name="location" placeholder="Location" value={form.location} onChange={update} required />
        <input name="category" placeholder="Category e.g. Engineering" value={form.category} onChange={update} required />
        <input name="industry" placeholder="Industry e.g. Software" value={form.industry} onChange={update} />
        <input name="majorTags" placeholder="Required majors, comma-separated" value={form.majorTags} onChange={update} />
        <input name="salaryMin" type="number" placeholder="Salary min" value={form.salaryMin} onChange={update} />
        <input name="salaryMax" type="number" placeholder="Salary max" value={form.salaryMax} onChange={update} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={update} required />
        <textarea name="requirements" placeholder="Requirements" value={form.requirements} onChange={update} />
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Posting...' : 'Publish Job'}</button>
      </form>
    </div>
  )
}
