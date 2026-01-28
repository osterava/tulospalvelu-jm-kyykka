'use client'

import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">Etusivu</Link>
      </div>

      <ul className={styles.links}>
        <li>
          <Link href="/login">Kirjaudu</Link>
        </li>
      </ul>
    </nav>
  )
}
