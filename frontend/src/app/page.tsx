import HeroCard from './components/home_components/HeroCard'
import InfoCard from './components/home_components/InfoCard'
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <HeroCard />
      <InfoCard />
    </div>
  );
}
