import React, { createContext, useState, useContext, useEffect } from 'react'
import API from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    setLoadingAuth(false)
  }, [])

  const saveSession = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const refreshProfile = async () => {
    const response = await API.get('/auth/profile')
    const updatedUser = response.data.user

    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)

    return updatedUser
  }

  const login = async (email, password, portalRole) => {
    const response = await API.post('/auth/login', {
      email,
      password,
      portalRole,
    })

    const { token, user } = response.data

    saveSession(token, user)

    return user
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('savedJobs')
  }

  const value = {
    user,
    setUser,
    loadingAuth,
    login,
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}