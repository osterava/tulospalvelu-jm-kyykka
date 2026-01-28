import styles from "../../page.module.css";
import SearchBox from "./SearchBox";
export default function HeroCard() {
  return (
    <div className={styles.card}>
      <h1>Tulospalvelu JM-kyykka.fi</h1>
      <p>Seuraa JM-kyykän tuloksia reaaliajassa</p>
      <SearchBox />
    </div>
  );
}
