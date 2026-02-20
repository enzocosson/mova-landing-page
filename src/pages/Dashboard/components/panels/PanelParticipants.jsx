import styles from "./Panels.module.scss";
import AppCta from "./AppCta";

const PanelParticipants = () => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Participants</span>
      <h2 className={styles.panelTitle}>
        Gestion des <span className={styles.accent}>participants</span>
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p>
        La liste des participants et leur
        <br />
        suivi sont disponibles dans l'app.
      </p>
      <AppCta compact />
    </div>
  </div>
);

export default PanelParticipants;
