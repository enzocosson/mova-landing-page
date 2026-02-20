import styles from "./StatsBar.module.scss";
import AnimatedCounter from "../shared/AnimatedCounter";

const STATS = [
  { value: 10, suffix: "s", label: "Fréquence de mise à jour" },
  { value: 360, suffix: "°", label: "Couverture du parcours" },
  { value: 3, suffix: " rôles", label: "Profils utilisateur" },
  { value: 100, suffix: "%", label: "Données temps réel" },
];

const StatsBar = () => (
  <section className={styles.bar} data-reveal>
    {STATS.map((s, i) => (
      <div key={i} className={styles.item}>
        <div className={styles.value}>
          <AnimatedCounter target={s.value} suffix={s.suffix} />
        </div>
        <div className={styles.label}>{s.label}</div>
      </div>
    ))}
  </section>
);

export default StatsBar;
