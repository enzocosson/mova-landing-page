import styles from "./Panels.module.scss";

const AppCta = ({ compact = false }) => (
  <div className={`${styles.appCta} ${compact ? styles.appCtaCompact : ""}`}>
    {!compact && (
      <>
        <span className={styles.tag}>— Application mobile —</span>
        <h3 className={styles.appCtaTitle}>
          Toutes tes données <span className={styles.accent}>dans l'app.</span>
        </h3>
        <p className={styles.appCtaSub}>
          Le dashboard complet est disponible sur l'application Mova.
          Télécharge-la pour accéder à toutes tes statistiques en temps réel.
        </p>
      </>
    )}
    <div className={styles.appCtaBtns}>
      <a href="#" className={styles.appBtnWhite}>
        App Store
      </a>
      <a href="#" className={styles.appBtnOutline}>
        Google Play
      </a>
    </div>
  </div>
);

export default AppCta;
