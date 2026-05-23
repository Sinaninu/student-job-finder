import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import API from '../services/api'

const AuthContext = createContext()

const SESSION_TIMEOUT = 2 * 60 * 1000 // 2 minutes
const LAST_ACTIVITY_KEY = 'lastActivity'

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  const clearSession = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('savedJobs')
    localStorage.removeItem(LAST_ACTIVITY_KEY)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY))

    if (storedUser && token) {
      const sessionExpired =
        lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT

      if (sessionExpired) {
        clearSession()
      } else {
        setUser(JSON.parse(storedUser))
        localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      }
    }

    setLoadingAuth(false)
  }, [clearSession])

  useEffect(() => {
    if (!user) return

    const updateActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
    }

    const checkInactivity = () => {
      const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY))

      if (!lastActivity) return

      if (Date.now() - lastActivity >= SESSION_TIMEOUT) {
        clearSession()
      }
    }

    const activityEvents = [
      'click',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
    ]

    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity)
    })

    const intervalId = setInterval(checkInactivity, 1000)

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity)
      })

      clearInterval(intervalId)
    }
  }, [user, clearSession])

  const saveSession = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
    setUser(userData)
  }

  const refreshProfile = async () => {
    const response = await API.get('/auth/profile')
    const updatedUser = response.data.user

    localStorage.setItem('user', JSON.stringify(updatedUser))
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
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
    clearSession()
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