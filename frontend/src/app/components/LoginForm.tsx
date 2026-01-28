'use client'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      await login(username, password)
      router.push('/admin')
    } catch (err) {
      console.error(err)
      setError('Virheellinen käyttäjänimi tai salasana')
    }
  }

  return (
    <div>
      <input
        placeholder="Käyttäjänimi"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Salasana"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Kirjaudu</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
