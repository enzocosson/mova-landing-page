import AppCta from "./AppCta";
import styles from "./Panels.module.scss";

const PanelApp = () => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Application</span>
      <h2 className={styles.panelTitle}>
        Télécharger <span className={styles.accent}>Mova</span>
      </h2>
    </div>
    <AppCta />
  </div>
);

export default PanelApp;
