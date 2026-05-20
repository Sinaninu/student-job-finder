import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import API from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(params.get('role') === 'company' ? 'company' : 'student')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await API.post('/auth/register', { name, email, password, role })
      alert('Account created successfully! Please login.')
      navigate('/login?role=' + role)
    } catch (err) {
      setError(err.response?.data?.message || (err.request ? 'Unable to reach the backend API. Please make sure the server is running on http://localhost:5000.' : err.message) || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" placeholder={role === 'company' ? 'Company contact name' : 'Full name'} value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
          </div>

          <div className="role-selector">
            <label className={`role-option ${role === 'student' ? 'active' : ''}`}>
              <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
              Student
            </label>
            <label className={`role-option ${role === 'company' ? 'active' : ''}`}>
              <input type="radio" name="role" value="company" checked={role === 'company'} onChange={() => setRole('company')} />
              Company
            </label>
          </div>

          <button className="btn-primary login-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="register-link">Already have an account? <Link to={`/login?role=${role}`}>Login</Link></p>
      </div>
    </div>
  )
}
