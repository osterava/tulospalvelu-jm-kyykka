import styles from "../../page.module.css";

export default function InfoCard() {
  return (
    <div className={styles.card}>
      <h2>Ajankohtaista</h2>
      <p>
        Lisätietoa tapahtumasta ja aikataulusta löydät{" "}
        <a href="https://jm-kyykka.fi">meidän nettisivuilta</a>
      </p>
      <p>
        Kysymykset: projektitiimi@jm-kyykka.fi
      </p>
    </div>
  );
}
