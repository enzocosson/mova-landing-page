import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NoiseBg from "../../components/shared/NoiseBg";
import Cursor from "../../components/Cursor/Cursor";
import DashHeader from "./components/DashHeader/DashHeader";
import Sidebar from "./components/Sidebar/Sidebar";
import PanelMap from "./components/panels/PanelMap";
import PanelStats from "./components/panels/PanelStats";
import PanelHistory from "./components/panels/PanelHistory";
import PanelEvents from "./components/panels/PanelEvents";
import PanelParticipants from "./components/panels/PanelParticipants";
import PanelResults from "./components/panels/PanelResults";
import PanelFollow from "./components/panels/PanelFollow";
import PanelProfil from "./components/panels/PanelProfil";
import PanelApp from "./components/panels/PanelApp";
import PanelRaces from "./components/panels/PanelRaces";
import styles from "./Dashboard.module.scss";

const ROLE_LABELS = {
  coureur: "Coureur",
  organisateur: "Organisateur",
  visitor: "Spectateur",
};
const ROLE_ICONS = {
  coureur: "🏃",
  organisateur: "📋",
  visitor: "👁️",
};

const PANELS = {
  map: PanelMap,
  races: PanelRaces,
  stats: PanelStats,
  history: PanelHistory,
  events: PanelEvents,
  participants: PanelParticipants,
  results: PanelResults,
  follow: PanelFollow,
  profil: PanelProfil,
  app: PanelApp,
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("map");
  const [selectedRace, setSelectedRace] = useState(null);

  const handleSelectRace = useCallback((race) => {
    setSelectedRace(race);
    setActiveTab("map");
  }, []);

  const handleClearRace = useCallback(() => {
    setSelectedRace(null);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user
    ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase()
    : "?";

  const role = user?.role ?? "visitor";
  const roleLabel = ROLE_LABELS[role] ?? role;
  const roleIcon = ROLE_ICONS[role] ?? "👤";

  const PanelComponent = PANELS[activeTab] ?? PanelMap;

  return (
    <div className={styles.page}>
      <NoiseBg />
      <Cursor />

      <div className={styles.bg}>
        <div className={styles.grid} />
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <DashHeader
        user={user}
        initials={initials}
        roleLabel={roleLabel}
        roleIcon={roleIcon}
        onLogout={handleLogout}
      />

      <div className={styles.layout}>
        <Sidebar
          role={role}
          roleLabel={roleLabel}
          roleIcon={roleIcon}
          activeTab={activeTab}
          onSelect={setActiveTab}
        />
        <main className={styles.content}>
          <PanelComponent
            user={user}
            initials={initials}
            roleLabel={roleLabel}
            roleIcon={roleIcon}
            onSelectRace={handleSelectRace}
            selectedRace={selectedRace}
            onClearRace={handleClearRace}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
