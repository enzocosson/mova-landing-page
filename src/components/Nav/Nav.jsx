import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Nav.module.scss";
import { useAuth } from "../../context/AuthContext";

const LINKS = ["Fonctionnalités", "Profils", "À Propos"];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setOpen(false);
    navigate("/");
  };

  const initials = user
    ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() ||
      "?"
    : "?";

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <img src="/full_logo_white.svg" alt="" />
      </div>

      <button
        className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`${styles.links} ${open ? styles.linksOpen : ""}`}>
        {LINKS.map((l) => (
          <li key={l}>
            <a href="#" onClick={() => setOpen(false)}>
              {l}
            </a>
          </li>
        ))}

        {/* Séparateur vertical */}
        <li className={styles.sep} aria-hidden="true" />

        {/* Auth / Profil */}
        <li className={styles.authGroup}>
          {isAuthenticated && user ? (
            // ── Profil connecté ──
            <div className={styles.profileWrapper} ref={dropRef}>
              <button
                type="button"
                className={styles.profileBtn}
                onClick={() => setDropOpen((v) => !v)}
                aria-expanded={dropOpen}
              >
                <div className={styles.profileAvatar}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={initials} />
                  ) : (
                    initials
                  )}
                </div>
                <div className={styles.profileMeta}>
                  <span className={styles.profileName}>
                    {user.firstname ?? ""} {user.lastname ?? ""}
                  </span>
                  <span className={styles.profileRole}>
                    {user.role === "organisateur"
                      ? "Organisateur"
                      : user.role === "coureur"
                        ? "Coureur"
                        : "Spectateur"}
                  </span>
                </div>
                <span
                  className={`${styles.profileChevron} ${dropOpen ? styles.profileChevronOpen : ""}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropUser}>
                    <span className={styles.dropUserName}>
                      {user.firstname ?? ""} {user.lastname ?? ""}
                    </span>
                    <span className={styles.dropUserEmail}>{user.email}</span>
                  </div>
                  <div className={styles.dropDivider} />
                  <Link
                    to="/dashboard"
                    className={styles.dropItem}
                    onClick={() => {
                      setDropOpen(false);
                      setOpen(false);
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className={`${styles.dropItem} ${styles.dropItemLogout}`}
                    onClick={handleLogout}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ── Non connecté ──
            <>
              <Link to="/login" className={styles.authLogin}>
                <span className={styles.authLoginIcon}>→</span>
                Se connecter
              </Link>
              <Link to="/register" className={styles.authDashboard}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                S'inscrire
              </Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
