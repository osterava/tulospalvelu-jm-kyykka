'use client'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useGroups } from './hooks/UseGroup'
import { useMatches } from './hooks/UseMatches'
import { GroupSelector } from './components/GroupSelector'
import { MatchSelector } from './components/MatchSelector'
import { ScoreForm } from './components/ScoreFrom'
import styles from './AdminPage.module.css'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  const { groups, statusMessage: groupStatus } = useGroups()
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const { matches, selectedMatch, setSelectedMatch, statusMessage: matchStatus, setStatusMessage } = useMatches(selectedGroup)

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  const handleScoreSubmit = async (homeScore: number, awayScore: number) => {
    if (!selectedMatch) return
    try {
      const res = await fetch(`http://localhost:8000/matches/${selectedMatch.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home_score: homeScore, away_score: awayScore })
      })
      if (!res.ok) throw new Error('Failed to submit score')
      setStatusMessage('Tulos päivitetty!')
      setSelectedMatch(null)
      setTimeout(() => setStatusMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setStatusMessage('Virhe tuloksen päivittämisessä')
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  return (
    <div className={styles.container}>
      {(groupStatus || matchStatus) && (
        <div className={styles.statusMessage}>{groupStatus || matchStatus}</div>
      )}

      <h1>Otteluiden tulokset</h1>
      <p>Täältä voit muokata otteluiden tuloksia</p>

      <GroupSelector groups={groups} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
      <MatchSelector matches={matches} selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} />
      {selectedMatch && <ScoreForm match={selectedMatch} onScoreSubmit={handleScoreSubmit} />}
    </div>
  )
}
