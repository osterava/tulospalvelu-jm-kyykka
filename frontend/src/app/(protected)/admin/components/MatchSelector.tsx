'use client'
import { Match } from '../hooks/UseMatches'
import styles from '../AdminPage.module.css'

interface Props {
  matches: Match[]
  selectedMatch: Match | null
  setSelectedMatch: (match: Match | null) => void
}

export function MatchSelector({ matches, selectedMatch, setSelectedMatch }: Props) {
  return matches.length > 0 ? (
    <div className={styles.section}>
      <label>Valitse ottelu:</label>
      <select
        value={selectedMatch?.id ?? ''}
        onChange={(e) => {
          const match = matches.find(m => m.id === Number(e.target.value)) || null
          setSelectedMatch(match)
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
  ) : null
}
