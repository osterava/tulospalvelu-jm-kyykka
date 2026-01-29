'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import styles from './AdminPage.module.css'

interface Match {
  id: number
  home_team: string
  away_team: string
  time: string
  field: string
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [groups] = useState<number[]>([1, 2])
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [homeScore, setHomeScore] = useState<number>(0)
  const [awayScore, setAwayScore] = useState<number>(0)
  const [statusMessage, setStatusMessage] = useState('')

  // Tarkistetaan kirjautuminen
  useEffect(() => {
    if (!user) router.replace('/login')
    else setLoading(false)
  }, [user, router])

  // Haetaan valitun lohkon ottelut
  useEffect(() => {
    if (selectedGroup === null) return

    const fetchMatches = async () => {
      try {
        const res = await fetch(`http://localhost:8000/matches/group/${selectedGroup}`)
        if (!res.ok) throw new Error('Fetch failed')
        const data: Match[] = await res.json()
        setMatches(data)
        setSelectedMatch(null)
      } catch (err) {
        console.error(err)
        setStatusMessage('Otteluiden hakeminen epäonnistui')
        setTimeout(() => setStatusMessage(''), 3000)
      }
    }

    fetchMatches()
  }, [selectedGroup])

  // Tallenna tulos
  const handleSubmitScore = async () => {
    if (!selectedMatch) return

    try {
      const res = await fetch(`http://localhost:8000/matches/${selectedMatch.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home_score: homeScore, away_score: awayScore })
      })
      if (!res.ok) throw new Error('Failed to submit score')

      setStatusMessage('Tulos päivitetty!')
      setHomeScore(0)
      setAwayScore(0)
      setSelectedMatch(null)

      setTimeout(() => setStatusMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setStatusMessage('Virhe tuloksen päivittämisessä')
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  if (loading) return null

  return (
    <div className={styles.container}>
      {statusMessage && (
        <div className={styles.statusMessage}>
          {statusMessage}
        </div>
      )}

      <h1>Tuomareiden dashboard</h1>
      <p>Täältä voit muokata otteluiden tuloksia</p>

      <div className={styles.section}>
        <label>Valitse lohko:</label>
        <select
          value={selectedGroup ?? ''}
          onChange={(e) => setSelectedGroup(Number(e.target.value))}
        >
          <option value="">-- Valitse lohko --</option>
          {groups.map(g => (
            <option key={g} value={g}>Lohko {g}</option>
          ))}
        </select>
      </div>

      {matches.length > 0 && (
        <div className={styles.section}>
          <label>Valitse ottelu:</label>
          <select
            value={selectedMatch?.id ?? ''}
            onChange={(e) => {
              const match = matches.find(m => m.id === Number(e.target.value)) || null
              setSelectedMatch(match)
              setHomeScore(0)
              setAwayScore(0)
            }}
          >
            <option value="">-- Valitse ottelu --</option>
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                {m.home_team} vs {m.away_team} ({new Date(m.time).toLocaleTimeString()})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedMatch && (
        <div className={styles.section}>
          <label>{selectedMatch.home_team}:</label>
          <input
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(Number(e.target.value))}
          />

          <label>{selectedMatch.away_team}:</label>
          <input
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(Number(e.target.value))}
          />

          <button onClick={handleSubmitScore}>Tallenna tulos</button>
        </div>
      )}
    </div>
  )
}
