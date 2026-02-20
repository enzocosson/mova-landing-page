import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import NoiseBg from "../../components/shared/NoiseBg";
import Cursor from "../../components/Cursor/Cursor";
import {
  IconArrow,
  IconGoogle,
  IconApple,
} from "../../components/shared/Icons";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../api/auth";

const ROLES = [
  { id: "runner", label: "Coureur" },
  { id: "organizer", label: "Organisateur" },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("runner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginVisitor, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si déjà connecté → redirection dashboard
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({ name, email, password, role });
      const token = data.accessToken || data.access_token;
      const userData = {
        _id: data.userId,
        email: data.email ?? email,
        firstname: data.firstname,
        lastname: data.lastname,
        profileImage: data.profileImage,
        role: data.role,
      };
      login(userData, token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleVisitor = () => {
    const visitorUser = {
      _id: "visitor",
      role: "visitor",
      firstname: "Visiteur",
    };
    // Ne persiste pas la session côté localStorage
    loginVisitor(visitorUser);
    navigate("/dashboard", { replace: true });
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
          <div className={styles.tag}>— Nouveau compte —</div>

          {/* Titre */}
          <h1 className={styles.title}>
            Rejoins <span className={styles.accent}>Mova.</span>
          </h1>
          <p className={styles.sub}>
            Crée ton compte gratuitement et rejoins des milliers de coureurs et
            organisateurs.
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
            <button
              type="button"
              className={styles.visitorBtn}
              onClick={handleVisitor}
            >
              <span>Continuer en tant que visiteur</span>
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
            {/* Rôle */}
            <div className={styles.field}>
              <label className={styles.label}>Je suis</label>
              <div className={styles.roles}>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`${styles.roleBtn} ${role === r.id ? styles.roleBtnActive : ""}`}
                    onClick={() => setRole(r.id)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Nom complet</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Thomas Martin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <span className={styles.hint}>8 caractères minimum</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${styles.submit} ${loading ? styles.submitLoading : ""}`}
            >
              <span>{loading ? "Création..." : "Créer mon compte"}</span>
              {!loading && <IconArrow />}
            </button>

            <p className={styles.legal}>
              En créant un compte tu acceptes nos <a href="#">CGU</a> et notre{" "}
              <a href="#">politique de confidentialité</a>.
            </p>
          </form>

          {/* Switch */}
          <p className={styles.switch}>
            Déjà un compte ?{" "}
            <Link to="/login" className={styles.switchLink}>
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
