"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTeams } from "../../services/teamsService";
import styles from "../../page.module.css";

export default function SearchBox() {
  const [team, setTeam] = useState("");
  const [teams, setTeams] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTeams().then(setTeams);
  }, []);

  const onChange = (value: string) => {
    setTeam(value);
    setOpen(true);
    setFiltered(
      teams.filter(t =>
        t.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const selectTeam = (name: string) => {
    router.push(`/matches/${encodeURIComponent(name)}`);
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.inputWrapper}>
        <input
          value={team}
          placeholder="Hae joukkue"
          onChange={e => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button
          className={styles.dropdownButton}
          onClick={() => setOpen(v => !v)}
        >
          ▼
        </button>
      </div>

      {open && (
        <ul className={styles.dropdown}>
          {(filtered.length ? filtered : teams).map(t => (
            <li key={t} onClick={() => selectTeam(t)}>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
