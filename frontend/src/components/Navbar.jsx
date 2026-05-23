import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const dashboardPath =
    user?.role === 'company'
      ? '/company/dashboard'
      : user?.role === 'admin'
        ? '/admin'
        : '/student/dashboard'

  const logoPath = user ? dashboardPath : '/'

  const handleLogout = () => {
    logout()
    navigate('/login?role=student', { replace: true })
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to={logoPath} className="logo" onClick={closeMobileMenu}>
          JobPortal
        </NavLink>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink
            to="/jobs"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Jobs
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            About
          </NavLink>

          {user?.role === 'student' && (
            <>
              <NavLink
                to={dashboardPath}
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/applications"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                My Apps
              </NavLink>

              <NavLink
                to="/saved-jobs"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Saved Jobs
              </NavLink>

              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Profile
              </NavLink>
            </>
          )}

          {user?.role === 'company' && (
            <>
              <NavLink
                to={dashboardPath}
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Recruiter Dashboard
              </NavLink>

              <NavLink
                to="/company/jobs/new"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Post Job
              </NavLink>

              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Company Profile
              </NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={closeMobileMenu}
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Admin
            </NavLink>
          )}
        </div>

        <div className="nav-user">
          {user ? (
            <>
              <span className="user-email">
                {user.email} ({user.role})
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login?role=student" className="login-link">
                Student Login
              </NavLink>
              <NavLink to="/login?role=company" className="login-link">
                Company Login
              </NavLink>
              <NavLink to="/login?role=admin" className="login-link">
                Admin Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}