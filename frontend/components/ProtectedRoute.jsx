import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, roles }) {
  const { user, loadingAuth } = useAuth()
  const location = useLocation()

  if (loadingAuth) return <p className="container">Loading...</p>

  if (!user) {
    return <Navigate to="/login?role=student" replace state={{ from: location }} />
  }

  const allowedRoles = Array.isArray(roles) ? roles : roles ? [roles] : []
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'company' ? '/company/dashboard' : user.role === 'admin' ? '/admin' : '/student/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children
}
