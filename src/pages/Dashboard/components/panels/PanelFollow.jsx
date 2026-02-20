import styles from "./Panels.module.scss";
import AppCta from "./AppCta";

const PanelFollow = () => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Suivi</span>
      <h2 className={styles.panelTitle}>
        Coureurs <span className={styles.accent}>suivis</span>
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
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <p>
        Suivez vos proches en temps réel
        <br />
        depuis l'application Mova.
      </p>
      <AppCta compact />
    </div>
  </div>
);

export default PanelFollow;
