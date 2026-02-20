import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import styles from "./Invite.module.scss";
import NoiseBg from "../../components/shared/NoiseBg";
import Cursor from "../../components/Cursor/Cursor";
import { IconArrow } from "../../components/shared/Icons";
import { useAuth } from "../../context/AuthContext";
import {
  checkInvitation,
  checkEmail,
  loginWithInvitation,
  registerWithInvitation,
} from "../../api/auth";

// Étapes possibles :
// loading | error | login | register | confirm | wrong-account | success

const Invite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");
  const {
    user,
    isAuthenticated,
    login,
    logout,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("loading");
  const [invitation, setInvitation] = useState(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Champs login / confirm
  const [password, setPassword] = useState("");

  // Champs register
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // ─── Chargement initial ──────────────────────────────────────────────────
  // On attend que AuthContext ait fini de restaurer la session depuis localStorage
  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setPageError("Lien d'invitation invalide : token manquant.");
      setStep("error");
      return;
    }

    const load = async () => {
      setStep("loading");
      try {
        const data = await checkInvitation(token);
        const inv = data.invitation;
        setInvitation(inv);

        // Invitation déjà traitée ?
        if (data.alreadyAccepted) {
          setPageError("Cette invitation a déjà été utilisée.");
          setStep("error");
          return;
        }

        // L'email de référence : celui de l'invitation (authorité) ou celui de l'URL
        const invitedEmail = inv.email || emailFromUrl;

        if (isAuthenticated && user) {
          if (user.email === invitedEmail) {
            // Bon compte connecté → confirmation de mot de passe
            setStep("confirm");
          } else {
            // Mauvais compte → proposer de se déconnecter
            setStep("wrong-account");
          }
        } else {
          // Non connecté → vérifier si l'email existe
          // Si l'email est déjà fourni dans l'URL on peut éviter un aller-retour
          // mais on appelle quand même l'API pour s'assurer de l'état réel
          const emailToCheck = invitedEmail;
          const emailCheck = await checkEmail(emailToCheck);
          setStep(emailCheck.exists ? "login" : "register");
        }
      } catch (err) {
        setPageError(err.message || "Invitation invalide ou expirée.");
        setStep("error");
      }
    };

    load();
  }, [token, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const data = await loginWithInvitation(invitation.email, password, token);
      const accessToken = data.access_token || data.accessToken;
      const userData = {
        _id: data._id,
        email: data.technicalUser?.email ?? invitation.email,
        firstname: data.firstname,
        lastname: data.lastname,
        profileImage: data.profileImage,
        role: data.role,
      };
      login(userData, accessToken);
      setStep("success");
    } catch (err) {
      setFormError(err.message || "Mot de passe incorrect.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");
    if (regPassword.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setFormLoading(true);
    try {
      const data = await registerWithInvitation({
        email: invitation.email,
        password: regPassword,
        firstname,
        lastname,
        invitationToken: token,
      });
      const accessToken = data.accessToken || data.access_token;
      const userData = {
        _id: data.userId,
        email: data.email ?? invitation.email,
        firstname: data.firstname ?? firstname,
        lastname: data.lastname ?? lastname,
        profileImage: data.profileImage,
        role: data.role,
      };
      login(userData, accessToken);
      setStep("success");
    } catch (err) {
      setFormError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const data = await loginWithInvitation(invitation.email, password, token);
      const accessToken = data.access_token || data.accessToken;
      const userData = {
        _id: data._id,
        email: data.technicalUser?.email ?? invitation.email,
        firstname: data.firstname,
        lastname: data.lastname,
        profileImage: data.profileImage,
        role: data.role,
      };
      login(userData, accessToken);
      setStep("success");
    } catch (err) {
      setFormError(err.message || "Mot de passe incorrect.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
    setFormError("");
    setPassword("");
    // Après déconnexion, vérifier l'email pour diriger vers login ou register
    if (invitation) {
      try {
        const emailCheck = await checkEmail(invitation.email);
        setStep(emailCheck.exists ? "login" : "register");
      } catch {
        setStep("login");
      }
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // ─── Composant carte de course ────────────────────────────────────────────
  const RaceCard = () =>
    invitation?.race ? (
      <div className={styles.raceCard}>
        <div className={styles.raceCardBadge}>📍 Course</div>
        <div className={styles.raceName}>{invitation.race.name}</div>
        {invitation.race.startDate && (
          <div className={styles.raceDate}>
            📅 {formatDate(invitation.race.startDate)}
          </div>
        )}
      </div>
    ) : null;

  // ─── Rendu selon l'étape ──────────────────────────────────────────────────
  const renderContent = () => {
    switch (step) {
      // ── Chargement ──
      case "loading":
        return (
          <div className={styles.card}>
            <div className={styles.loader}>
              <span />
              <span />
              <span />
            </div>
            <p className={styles.loaderText}>Vérification de l'invitation…</p>
          </div>
        );

      // ── Erreur ──
      case "error":
        return (
          <div className={styles.card}>
            <div className={styles.tag}>— Invitation —</div>
            <h1 className={styles.title}>
              Invitation <span className={styles.accentRed}>invalide.</span>
            </h1>
            <p className={styles.sub}>{pageError}</p>
            <Link to="/" className={styles.submit}>
              <span>Retour à l'accueil</span>
              <IconArrow />
            </Link>
          </div>
        );

      // ── Connexion (email existe) ──
      case "login":
        return (
          <div className={styles.card}>
            <div className={styles.tag}>— Invitation —</div>
            <h1 className={styles.title}>
              Rejoins la <span className={styles.accent}>course.</span>
            </h1>
            <p className={styles.sub}>
              Tu as été invité à participer. Connecte-toi pour accepter.
            </p>
            <RaceCard />
            {formError && <p className={styles.errorMsg}>{formError}</p>}
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={`${styles.input} ${styles.inputLocked}`}
                  value={invitation?.email ?? ""}
                  readOnly
                />
                <span className={styles.hint}>
                  Email de l'invitation — non modifiable
                </span>
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
                  autoFocus
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className={`${styles.submit} ${formLoading ? styles.submitLoading : ""}`}
              >
                <span>
                  {formLoading ? "Connexion…" : "Accepter l'invitation"}
                </span>
                {!formLoading && <IconArrow />}
              </button>
            </form>
            <p className={styles.switchRow}>
              Pas encore de compte ?{" "}
              <button
                type="button"
                className={styles.switchLink}
                onClick={() => {
                  setFormError("");
                  setStep("register");
                }}
              >
                S'inscrire
              </button>
            </p>
          </div>
        );

      // ── Inscription (email n'existe pas) ──
      case "register":
        return (
          <div className={styles.card}>
            <div className={styles.tag}>— Invitation —</div>
            <h1 className={styles.title}>
              Crée ton <span className={styles.accent}>compte.</span>
            </h1>
            <p className={styles.sub}>
              Inscris-toi pour rejoindre la course et suivre ta progression.
            </p>
            <RaceCard />
            {formError && <p className={styles.errorMsg}>{formError}</p>}
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.fieldsRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Prénom</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Thomas"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    autoFocus
                    autoComplete="given-name"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Nom</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Martin"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={`${styles.input} ${styles.inputLocked}`}
                  value={invitation?.email ?? ""}
                  readOnly
                />
                <span className={styles.hint}>
                  Email de l'invitation — non modifiable
                </span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Mot de passe</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <span className={styles.hint}>8 caractères minimum</span>
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className={`${styles.submit} ${formLoading ? styles.submitLoading : ""}`}
              >
                <span>
                  {formLoading ? "Création…" : "Créer mon compte et rejoindre"}
                </span>
                {!formLoading && <IconArrow />}
              </button>
            </form>
            <p className={styles.switchRow}>
              Déjà un compte ?{" "}
              <button
                type="button"
                className={styles.switchLink}
                onClick={() => {
                  setFormError("");
                  setStep("login");
                }}
              >
                Se connecter
              </button>
            </p>
          </div>
        );

      // ── Confirmer (connecté avec le bon email) ──
      case "confirm":
        return (
          <div className={styles.card}>
            <div className={styles.tag}>— Invitation —</div>
            <h1 className={styles.title}>
              Tu es <span className={styles.accent}>invité !</span>
            </h1>
            <p className={styles.sub}>
              Confirme ton identité pour rejoindre la course.
            </p>
            <RaceCard />
            <div className={styles.connectedAs}>
              <span className={styles.connectedDot} />
              Connecté en tant que <strong>{user?.email}</strong>
            </div>
            {formError && <p className={styles.errorMsg}>{formError}</p>}
            <form className={styles.form} onSubmit={handleConfirm}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Confirme ton mot de passe
                </label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className={`${styles.submit} ${formLoading ? styles.submitLoading : ""}`}
              >
                <span>
                  {formLoading ? "Vérification…" : "Rejoindre la course"}
                </span>
                {!formLoading && <IconArrow />}
              </button>
            </form>
          </div>
        );

      // ── Mauvais compte ──
      case "wrong-account":
        return (
          <div className={styles.card}>
            <div className={styles.tag}>— Invitation —</div>
            <h1 className={styles.title}>
              Mauvais <span className={styles.accentRed}>compte.</span>
            </h1>
            <p className={styles.sub}>
              Cette invitation est destinée à un autre email.
            </p>
            <RaceCard />
            <div className={styles.alertBox}>
              <div className={styles.alertRow}>
                <span className={styles.alertLabel}>Invitation pour</span>
                <strong className={styles.alertEmailTarget}>
                  {invitation?.email}
                </strong>
              </div>
              <div className={styles.alertDivider} />
              <div className={styles.alertRow}>
                <span className={styles.alertLabel}>Connecté en tant que</span>
                <strong className={styles.alertEmailWrong}>
                  {user?.email}
                </strong>
              </div>
            </div>
            <button
              type="button"
              className={styles.submitOutline}
              onClick={handleLogout}
            >
              <span>Se déconnecter et changer de compte</span>
            </button>
            <Link to="/" className={styles.backLink}>
              ← Retour à l'accueil
            </Link>
          </div>
        );

      // ── Succès ──
      case "success":
        return (
          <div className={`${styles.card} ${styles.cardSuccess}`}>
            <div className={styles.successEmoji}>🎉</div>
            <div className={styles.tag}>— Bienvenue ! —</div>
            <h1 className={styles.title}>
              Tu es dans <span className={styles.accent}>la course !</span>
            </h1>
            {invitation?.race && (
              <p className={styles.sub}>
                Tu as rejoint <strong>{invitation.race.name}</strong>. Bonne
                chance !
              </p>
            )}
            <button
              type="button"
              className={styles.submit}
              onClick={() => navigate("/dashboard", { replace: true })}
            >
              <span>Accéder au dashboard</span>
              <IconArrow />
            </button>
          </div>
        );

      default:
        return null;
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

      {/* Contenu */}
      <main className={styles.main}>{renderContent()}</main>
    </div>
  );
};

export default Invite;
