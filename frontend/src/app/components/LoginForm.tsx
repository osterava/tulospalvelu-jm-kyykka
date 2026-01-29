'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import styles from './LoginForm.module.css'

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
    <div className={styles.container}>
      <h1>Kirjaudu sisään</h1>
      <input
        className={styles.input}
        placeholder="Käyttäjänimi"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Salasana"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.button} onClick={handleLogin}>Kirjaudu</button>
      {error && <p className={styles.error}>{error}</p>}
      <p>Ongelmia?</p>
      <p>Ota yhteyttä: projektitiimi@jm-kyykka.fi</p>
    </div>
  )
}
