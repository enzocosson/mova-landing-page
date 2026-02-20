import styles from "./Footer.module.scss";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.logo}>
      <img src="/full_logo_white.svg" alt="Mova" />
    </div>
    <p>© 2026 Mova · Tous droits réservés</p>
    <div className={styles.links}>
      {["Confidentialité", "CGU", "Contact"].map((l) => (
        <a key={l} href="#">
          {l}
        </a>
      ))}
    </div>
  </footer>
);

export default Footer;
