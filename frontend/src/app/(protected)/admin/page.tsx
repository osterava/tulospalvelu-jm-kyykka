'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = () => {
      if (!user) {
        router.replace('/login')
      } else {
        setLoading(false)
      }
    }

    setTimeout(checkUser, 0)
  }, [user, router])

  if (loading) return null

  return (
    <div>
      <h1>Admin-etusivu</h1>
      <p>Tervetuloa, {user}!</p>
    </div>
  )
}
