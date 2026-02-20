import { useState } from "react";
import styles from "./DownloadAuth.module.scss";
import {
  IconApple,
  IconGoogle,
  IconDashboard,
  IconArrow,
} from "../shared/Icons";

const AuthForm = () => {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className={styles.authWrap}>
      <div className={styles.authTabs}>
        <button
          className={`${styles.authTab} ${tab === "login" ? styles.authTabActive : ""}`}
          onClick={() => setTab("login")}
        >
          Se connecter
        </button>
        <button
          className={`${styles.authTab} ${tab === "register" ? styles.authTabActive : ""}`}
          onClick={() => setTab("register")}
        >
          S'inscrire
        </button>
      </div>
      <div className={styles.authBody}>
        {tab === "register" && (
          <div className={styles.field}>
            <label className={styles.label}>Nom complet</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Thomas Martin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Mot de passe</label>
          <input
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {tab === "login" && (
          <div className={styles.forgot}>
            <a href="#">Mot de passe oublié ?</a>
          </div>
        )}
        <button className={styles.submit}>
          <span>
            {tab === "login" ? "Accéder au dashboard" : "Créer mon compte"}
          </span>
          <IconDashboard />
        </button>
        {tab === "register" && (
          <p className={styles.legal}>
            En créant un compte vous acceptez nos <a href="#">CGU</a> et notre{" "}
            <a href="#">politique de confidentialité</a>.
          </p>
        )}
      </div>
    </div>
  );
};

const DownloadAuth = () => (
  <section className={styles.section} data-reveal>
    <div className={styles.grid}>
      {/* ── App mobile ── */}
      <div className={styles.col}>
        <div className={styles.colInner}>
          <span className={styles.tag}>— Application mobile</span>
          <h2>
            Courez avec
            <br />
            <span className={styles.accent}>Mova.</span>
          </h2>
          <p>
            Téléchargez l'application gratuitement et rejoignez des milliers de
            coureurs qui vivent la course autrement.
          </p>
          <div className={styles.stores}>
            <a href="#" className={styles.storeBtn}>
              <IconApple />
              <div className={styles.storeBtnText}>
                <span className={styles.storeSub}>Télécharger sur l'</span>
                <span className={styles.storeMain}>App Store</span>
              </div>
            </a>
            <a href="#" className={styles.storeBtn}>
              <IconGoogle />
              <div className={styles.storeBtnText}>
                <span className={styles.storeSub}>Disponible sur</span>
                <span className={styles.storeMain}>Google Play</span>
              </div>
            </a>
          </div>
          <div className={styles.ratings}>
            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingLbl}>4.9 · App Store</span>
            </div>
            <div className={styles.ratingDivider} />
            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingLbl}>4.8 · Google Play</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* ── Dashboard ── */}
      <div className={`${styles.col} ${styles.colDark}`}>
        <div className={styles.colInner}>
          <span className={styles.tag}>— Dashboard organisateur</span>
          <h2>
            Gérez vos
            <br />
            <span className={styles.accent}>courses.</span>
          </h2>
          <p>
            Accédez à votre espace organisateur pour créer des événements,
            suivre les participants et exporter vos résultats.
          </p>
          <AuthForm />
        </div>
      </div>
    </div>
  </section>
);

export default DownloadAuth;
