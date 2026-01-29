'use client'
import { useState } from 'react'
import { Match } from '../hooks/UseMatches'
import styles from '../AdminPage.module.css'

interface Props {
  match: Match
  onScoreSubmit: (homeScore: number, awayScore: number) => void
}

export function ScoreForm({ match, onScoreSubmit }: Props) {
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)

  return (
    <div className={styles.section}>
      <label>{match.home_team}:</label>
      <input type="number" value={homeScore} onChange={e => setHomeScore(Number(e.target.value))} />

      <label>{match.away_team}:</label>
      <input type="number" value={awayScore} onChange={e => setAwayScore(Number(e.target.value))} />

      <button onClick={() => onScoreSubmit(homeScore, awayScore)}>Tallenna tulos</button>
    </div>
  )
}
