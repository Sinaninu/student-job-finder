import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Find the Right Job<br />for Your Future</h1>
        <p>Discover part-time and entry-level jobs all in one place.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate('/login?role=student')}>
            Get Started
          </button>
          <button className="btn-outline" onClick={() => navigate('/login?role=company')}>
            I'm a Company
          </button>
        </div>
      </div>
    </div>
  )
}