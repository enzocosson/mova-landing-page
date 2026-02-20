import styles from "./Panels.module.scss";
import AppCta from "./AppCta";

const PanelHistory = () => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Historique</span>
      <h2 className={styles.panelTitle}>
        Mes <span className={styles.accent}>courses passées</span>
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
          <polyline points="12 8 12 12 14 14" />
          <path d="M3.05 11a9 9 0 1 1 .5 4" />
          <polyline points="3 16 3.05 11 8 11" />
        </svg>
      </div>
      <p>
        Votre historique de courses
        <br />
        est disponible dans l'application.
      </p>
      <AppCta compact />
    </div>
  </div>
);

export default PanelHistory;
