import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, setUser, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [resumeFile, setResumeFile] = useState(null)

  const [profile, setProfile] = useState({
    name: user?.name || '',
    major: user?.studentProfile?.major || '',
    skills: user?.studentProfile?.skills?.join(', ') || '',
    companyName: user?.companyProfile?.companyName || '',
    website: user?.companyProfile?.website || '',
    industry: user?.companyProfile?.industry || '',
    logoUrl: user?.companyProfile?.logoUrl || '',
    description: user?.companyProfile?.description || '',
  })

  const update = (e) => setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const saveProfile = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const payload = user.role === 'student'
        ? {
            name: profile.name,
            major: profile.major,
            skills: profile.skills.split(',').map((x) => x.trim()).filter(Boolean),
          }
        : {
            name: profile.name,
            companyName: profile.companyName,
            website: profile.website,
            industry: profile.industry,
            logoUrl: profile.logoUrl,
            description: profile.description,
          }
      const response = await API.put('/auth/profile', payload)
      setUser(response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setMessage('Profile saved.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile')
    }
  }

  const uploadResume = async (e) => {
    e.preventDefault()
    if (!resumeFile) return
    setError('')
    setMessage('')
    try {
      const data = new FormData()
      data.append('resume', resumeFile)
      await API.post('/auth/resume', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      await refreshProfile()
      setResumeFile(null)
      setMessage('Resume uploaded.')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not upload resume')
    }
  }

  const deleteResume = async () => {
    if (!window.confirm('Delete your uploaded CV?')) return
    await API.delete('/auth/resume')
    await refreshProfile()
    setMessage('Resume deleted.')
  }

  const resumeUrl = user?.resume?.url ? `http://localhost:5000${user.resume.url}` : null

  return (
    <div className="container form-page">
      <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
      <h2>{user?.role === 'company' ? 'Company Profile' : 'Student Profile & CV'}</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form className="card form-grid" onSubmit={saveProfile}>
        <input name="name" placeholder="Name" value={profile.name} onChange={update} required />

        {user?.role === 'student' ? (
          <>
            <input name="major" placeholder="Major" value={profile.major} onChange={update} />
            <input name="skills" placeholder="Skills, comma-separated" value={profile.skills} onChange={update} />
          </>
        ) : (
          <>
            <input name="companyName" placeholder="Company name" value={profile.companyName} onChange={update} />
            <input name="website" placeholder="Website" value={profile.website} onChange={update} />
            <input name="industry" placeholder="Industry" value={profile.industry} onChange={update} />
            <input name="logoUrl" placeholder="Logo URL" value={profile.logoUrl} onChange={update} />
            <textarea name="description" placeholder="Company description" value={profile.description} onChange={update} />
          </>
        )}

        <button className="btn-primary" type="submit">Save Profile</button>
      </form>

      {user?.role === 'student' && (
        <div className="card">
          <h3>CV / Resume</h3>
          {resumeUrl ? (
            <p>
              Current file: <a href={resumeUrl} target="_blank" rel="noreferrer">{user.resume.originalName || 'View CV'}</a>
            </p>
          ) : (
            <p>No CV uploaded yet.</p>
          )}
          <form onSubmit={uploadResume} className="upload-row">
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            <button className="btn-primary" type="submit" disabled={!resumeFile}>Upload CV</button>
          </form>
          {resumeUrl && <button className="btn-delete" onClick={deleteResume}>Delete CV</button>}
        </div>
      )}
    </div>
  )
}
