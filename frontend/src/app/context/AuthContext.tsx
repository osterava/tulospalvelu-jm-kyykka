'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username') 
    if (token && username) {
      setUser(username)
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const data = await authService.login(username, password)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('username', username) 
    setUser(username)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUser(null)
  }

  if (loading) return null
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
