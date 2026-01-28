'use client'

import { useAuth } from '../context/AuthContext'
import { redirect } from 'next/navigation'

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}
