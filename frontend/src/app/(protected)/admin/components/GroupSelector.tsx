'use client'
import styles from '../AdminPage.module.css'

interface Props {
  groups: number[]
  selectedGroup: number | null
  setSelectedGroup: (group: number) => void
}

export function GroupSelector({ groups, selectedGroup, setSelectedGroup }: Props) {
  return (
    <div className={styles.section}>
      <label>Valitse lohko:</label>
      <select value={selectedGroup ?? ''} onChange={(e) => setSelectedGroup(Number(e.target.value))}>
        <option value="">-- Valitse lohko --</option>
        {groups.map(g => (
          <option key={g} value={g}>Lohko {g}</option>
        ))}
      </select>
    </div>
  )
}
