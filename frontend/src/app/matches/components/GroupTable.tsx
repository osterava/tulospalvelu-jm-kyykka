import Link from 'next/link'
import { GroupTeam } from './types/team'
import styles from './GroupTable.module.css'

interface Props {
  teams: GroupTeam[]
}

export function GroupTable({ teams }: Props) {
  if (teams.length === 0) {
    return <p className={styles.empty}>Lohkotietoja ei ole saatavilla.</p>
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Joukkue</th>
          <th>Voitot</th>
          <th>Häviöt</th>
          <th>Tasapelit</th>
          <th>Pisteet</th>
          <th>Kokonaistulos</th>
        </tr>
      </thead>
      <tbody>
        {teams.map(team => (
          <tr key={team.team}>
            <td data-label="Joukkue">
              <Link
                href={`/matches/${encodeURIComponent(team.team)}`}
                className={styles.teamLink}
              >
                {team.team}
              </Link>
            </td>
            <td data-label="Voitot">{team.wins}</td>
            <td data-label="Häviöt">{team.losses}</td>
            <td data-label="Tasapelit">{team.draws}</td>
            <td data-label="Pisteet">{team.points}</td>
            <td data-label="Kokonaistulos">{team.total_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
