import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="logo">JobPortal</NavLink>
        
        {/* Hamburger Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active-link' : ''}>Jobs</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>About</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>Dashboard</NavLink>
              <NavLink to="/applications" className={({ isActive }) => isActive ? 'active-link' : ''}>My Apps</NavLink>
              <NavLink to="/saved-jobs" className={({ isActive }) => isActive ? 'active-link' : ''}>Saved Jobs</NavLink>
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
            <NavLink to="/login?role=student" className="login-link">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}