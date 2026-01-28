'use client'
import { createContext, useContext, useState } from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    const data = await authService.login(username, password)
    console.log('Login response:', data)
    localStorage.setItem('token', data.access_token)
    setUser(username)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
