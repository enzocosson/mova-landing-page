import styles from "./Panels.module.scss";
import AppCta from "./AppCta";

const PanelResults = () => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Résultats</span>
      <h2 className={styles.panelTitle}>
        Classements & <span className={styles.accent}>résultats</span>
      </h2>
    </div>
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <rect x="18" y="3" width="4" height="18" />
          <rect x="10" y="8" width="4" height="13" />
          <rect x="2" y="13" width="4" height="8" />
        </svg>
      </div>
      <p>
        Les résultats en temps réel
        <br />
        sont disponibles dans l'application.
      </p>
      <AppCta compact />
    </div>
  </div>
);

export default PanelResults;
