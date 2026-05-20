import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const role = params.get('role') === 'company' ? 'company' : 'student'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password, role)
      if (user.role === 'admin') navigate('/admin', { replace: true })
      else if (user.role === 'company') navigate('/company/dashboard', { replace: true })
      else navigate('/student/dashboard', { replace: true })
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login <span className="role-badge">({role})</span></h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <button className="btn-primary login-btn" disabled={loading} type="submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to={`/register?role=${role}`}>Register</Link>
        </p>
        <p className="register-link">
          {role === 'student' ? <Link to="/login?role=company">Company login</Link> : <Link to="/login?role=student">Student login</Link>}
        </p>
      </div>
    </div>
  )
}
