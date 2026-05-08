import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">JobPortal</Link>
        <div className="nav-links">
          <Link to="/jobs">Jobs</Link>
          <Link to="/about">About</Link>
          {user && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/applications">My Applications</Link>
            </>
          )}
        </div>
        <div className="nav-user">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login?role=student" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}