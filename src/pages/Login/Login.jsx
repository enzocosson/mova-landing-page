import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import NoiseBg from "../../components/shared/NoiseBg";
import Cursor from "../../components/Cursor/Cursor";
import {
  IconArrow,
  IconGoogle,
  IconApple,
} from "../../components/shared/Icons";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si déjà connecté → redirection dashboard
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      const token = data.access_token || data.accessToken;
      const userData = {
        _id: data._id,
        email: data.technicalUser?.email ?? email,
        firstname: data.firstname,
        lastname: data.lastname,
        profileImage: data.profileImage,
        role: data.role,
      };
      login(userData, token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <NoiseBg />
      <Cursor />

      {/* Fond animé */}
      <div className={styles.bg}>
        <div className={styles.grid} />
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src="/full_logo_white.svg" alt="Mova" />
        </Link>
        <Link to="/" className={styles.back}>
          <span className={styles.backArrow}>←</span>
          Retour au site
        </Link>
      </header>

      {/* Contenu centré */}
      <main className={styles.main}>
        <div className={styles.card}>
          {/* Tag */}
          <div className={styles.tag}>— Authentification —</div>

          {/* Titre */}
          <h1 className={styles.title}>
            Content de te <span className={styles.accent}>revoir.</span>
          </h1>
          <p className={styles.sub}>
            Connecte-toi pour accéder à ton dashboard, tes courses et ton
            classement en temps réel.
          </p>

          {/* Social */}
          <div className={styles.social}>
            <button className={styles.socialBtn}>
              <IconGoogle />
              <span>Continuer avec Google</span>
            </button>
            <button className={styles.socialBtn}>
              <IconApple />
              <span>Continuer avec Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>ou par email</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Message d'erreur */}
          {error && <p className={styles.errorMsg}>{error}</p>}

          {/* Formulaire */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 36 }}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className={styles.forgot}>
              <a href="#">Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${styles.submit} ${loading ? styles.submitLoading : ""}`}
            >
              <span>{loading ? "Connexion..." : "Accéder au dashboard"}</span>
              {!loading && <IconArrow />}
            </button>
          </form>

          {/* Switch */}
          <p className={styles.switch}>
            Pas encore de compte ?{" "}
            <Link to="/register" className={styles.switchLink}>
              S'inscrire
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
