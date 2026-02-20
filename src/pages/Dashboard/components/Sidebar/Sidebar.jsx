import styles from "./Sidebar.module.scss";

const IcoMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13V7m0 13 6-3M9 7l6-3m6 17-6 3m6-3V5m0 0-6 3" />
  </svg>
);
const IcoStats = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3v18h18" />
    <path d="m7 16 4-4 4 4 4-4" />
  </svg>
);
const IcoHistory = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 1 .5 4" />
    <polyline points="3 16 3.05 11 8 11" />
  </svg>
);
const IcoProfil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IcoEvent = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IcoParticipants = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoResults = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="18" y="3" width="4" height="18" />
    <rect x="10" y="8" width="4" height="13" />
    <rect x="2" y="13" width="4" height="8" />
  </svg>
);
const IcoFollow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IcoRace = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const MENUS = {
  coureur: [
    { id: "map", label: "Carte live", icon: <IcoMap /> },
    { id: "races", label: "Mes courses", icon: <IcoRace /> },
    { id: "stats", label: "Mes stats", icon: <IcoStats /> },
    { id: "history", label: "Historique", icon: <IcoHistory /> },
    { id: "profil", label: "Mon profil", icon: <IcoProfil /> },
    { id: "app", label: "Application", icon: <IcoDownload /> },
  ],
  organisateur: [
    { id: "map", label: "Carte live", icon: <IcoMap /> },
    { id: "races", label: "Mes courses", icon: <IcoRace /> },
    { id: "events", label: "Événements", icon: <IcoEvent /> },
    { id: "participants", label: "Participants", icon: <IcoParticipants /> },
    { id: "results", label: "Résultats", icon: <IcoResults /> },
    { id: "profil", label: "Mon profil", icon: <IcoProfil /> },
    { id: "app", label: "Application", icon: <IcoDownload /> },
  ],
  visitor: [
    { id: "map", label: "Carte live", icon: <IcoMap /> },
    { id: "follow", label: "Je suis", icon: <IcoFollow /> },
    { id: "results", label: "Résultats", icon: <IcoResults /> },
    { id: "profil", label: "Mon profil", icon: <IcoProfil /> },
    { id: "app", label: "Application", icon: <IcoDownload /> },
  ],
};

const Sidebar = ({ role, roleLabel, roleIcon, activeTab, onSelect }) => {
  const menu = MENUS[role] ?? MENUS.visitor;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {menu.map((item) => (
          <button
            key={item.id}
            className={`${styles.item} ${activeTab === item.id ? styles.itemActive : ""}`}
            onClick={() => onSelect(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
            {activeTab === item.id && <span className={styles.activeLine} />}
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.roleBadge}>
          <span>{roleIcon}</span>
          <span>{roleLabel}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
