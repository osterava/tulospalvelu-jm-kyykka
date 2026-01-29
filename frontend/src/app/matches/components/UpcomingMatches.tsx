import { Match } from './types/team'
import styles from './UpcomingMatches.module.css'

interface Props {
  matches: Match[]
}

export function UpcomingMatches({ matches }: Props) {
  if (matches.length === 0) {
    return <p className={styles.empty}>Ei tulevia otteluita.</p>
  }

  return (
    <ul className={styles.list}>
      {matches.map(match => (
        <li key={match.id} className={styles.item}>
          <span className={styles.teams}>
            {match.home_team} vs {match.away_team}
          </span>
          <span className={styles.time}>
            {new Date(match.time).toLocaleString()}
          </span>
          <span className={styles.field}>{match.field || 'tba'}</span>
        </li>
      ))}
    </ul>
  )
}
