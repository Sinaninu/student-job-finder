import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

// ✅ Named export – make sure it's exactly as written
export function useAuth() {
  return useContext(AuthContext)
}

// ✅ Default export for the provider
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const found = storedUsers.find(u => u.email === email && u.password === password)
    if (found) {
      const userData = { email: found.email, role: found.role }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }
    if (email === 'test@example.com' && password === '123456') {
      const userData = { email, role: 'student' }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = (email, password, role) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    if (storedUsers.some(u => u.email === email)) {
      alert('Email already exists. Please login.')
      return false
    }
    const newUser = { email, password, role }
    storedUsers.push(newUser)
    localStorage.setItem('users', JSON.stringify(storedUsers))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = { user, login, register, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}