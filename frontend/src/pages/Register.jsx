import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth() // assuming you have a register function in AuthContext
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // 'student' or 'company'
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = () => {
    if (register(email, password, role)) {
      navigate('/login?role=' + role)
    } else {
      alert('Registration failed (demo)')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <div className="role-selector">
          <label className={`role-option ${role === 'student' ? 'active' : ''}`}>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
            />
            Student
          </label>
          <label className={`role-option ${role === 'company' ? 'active' : ''}`}>
            <input
              type="radio"
              name="role"
              value="company"
              checked={role === 'company'}
              onChange={() => setRole('company')}
            />
            Company
          </label>
        </div>
        <button className="btn-primary login-btn" onClick={handleRegister}>
          Create Account
        </button>
        <p className="register-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}