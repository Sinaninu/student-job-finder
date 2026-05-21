import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === 'company') return <Navigate to="/company/dashboard" replace />
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/student/dashboard" replace />
}
