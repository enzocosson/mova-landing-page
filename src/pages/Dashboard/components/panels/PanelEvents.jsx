import styles from "./Panels.module.scss";
import AppCta from "./AppCta";

const PanelEvents = () => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Événements</span>
      <h2 className={styles.panelTitle}>
        Mes <span className={styles.accent}>événements</span>
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
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
      <p>
        Créez et gérez vos événements
        <br />
        depuis l'application mobile.
      </p>
      <AppCta compact />
    </div>
  </div>
);

export default PanelEvents;
