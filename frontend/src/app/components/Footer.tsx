import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()}{' '}
        <a href="https://jm-kyykka.fi">JM-kyykka.fi</a>
      </p>
    </footer>
  )
}
