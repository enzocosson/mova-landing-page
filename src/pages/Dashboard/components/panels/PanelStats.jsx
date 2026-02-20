import styles from "./Panels.module.scss";
import AppCta from "./AppCta";

const STATS = [
  { val: "—", lbl: "Courses disputées", desc: "Disponible dans l'app" },
  { val: "—", lbl: "Km parcourus", desc: "Disponible dans l'app" },
  { val: "—", lbl: "Meilleure allure", desc: "Disponible dans l'app" },
  { val: "—", lbl: "Temps total en course", desc: "Disponible dans l'app" },
  { val: "—", lbl: "Classement moyen", desc: "Disponible dans l'app" },
  { val: "—", lbl: "BPM moyen", desc: "Disponible dans l'app" },
];

const PanelStats = () => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Statistiques</span>
      <h2 className={styles.panelTitle}>
        Mes <span className={styles.accent}>performances</span>
      </h2>
    </div>
    <div className={styles.statsGrid}>
      {STATS.map((s) => (
        <div key={s.lbl} className={styles.statCard}>
          <div className={styles.statValue}>{s.val}</div>
          <div className={styles.statLabel}>{s.lbl}</div>
          <div className={styles.statDesc}>{s.desc}</div>
        </div>
      ))}
    </div>
    <AppCta />
  </div>
);

export default PanelStats;
