import { useState, useEffect, useCallback } from "react";
import styles from "./Panels.module.scss";
import raceStyles from "./PanelRaces.module.scss";
import { useAuth } from "../../../../context/AuthContext";
import { fetchMyRaces, fetchAllRaces, fetchRace } from "../../../../api/races";

// ─── Helpers ──────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const STATUS_LABEL = {
  upcoming: "À venir",
  ongoing: "En cours",
  completed: "Terminée",
};
const STATUS_COLOR = {
  upcoming: "statusUpcoming",
  ongoing: "statusOngoing",
  completed: "statusCompleted",
};

const computeStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  if (end && now > end) return "completed";
  if (now >= start && (!end || now <= end)) return "ongoing";
  return "upcoming";
};

// ─── Badge de statut ──────────────────────────────
const StatusBadge = ({ status }) => (
  <span
    className={`${raceStyles.statusBadge} ${raceStyles[STATUS_COLOR[status] ?? "statusUpcoming"]}`}
  >
    {status === "ongoing" && <span className={raceStyles.liveDot} />}
    {STATUS_LABEL[status] ?? status}
  </span>
);

// ─── Carte de course (coureur) ────────────────────
const RunnerRaceCard = ({ race, onSelect, isLoading }) => {
  const status = race.status ?? computeStatus(race.startDate, race.endDate);
  return (
    <button
      type="button"
      className={`${raceStyles.raceCard} ${raceStyles.raceCardClickable} ${
        isLoading ? raceStyles.raceCardLoading : ""
      }`}
      onClick={onSelect}
    >
      <div className={raceStyles.raceCardTop}>
        <div className={raceStyles.raceMeta}>
          <span className={raceStyles.raceName}>{race.name}</span>
          <span className={raceStyles.raceOrg}>
            {race.organization?.name ??
              race.location ??
              "Organisation inconnue"}
          </span>
        </div>
        <div className={raceStyles.raceCardActions}>
          <StatusBadge status={status} />
          {isLoading && <span className={raceStyles.cardSpinner} />}
        </div>
      </div>
      <div className={raceStyles.raceCardBottom}>
        <span className={raceStyles.raceDateItem}>
          <IcoCalendar />
          {fmtDate(race.startDate)}
        </span>
        {race.endDate && (
          <span className={raceStyles.raceDateItem}>
            <IcoFlag />
            {fmtDate(race.endDate)}
          </span>
        )}
        {race.distance && (
          <span className={raceStyles.raceDateItem}>
            <IcoRoute />
            {race.distance} km
          </span>
        )}
      </div>
    </button>
  );
};

// ─── Ligne participant (organisateur) ────────────
const ParticipantRow = ({ runner }) => {
  const initials =
    `${runner.firstname?.[0] ?? ""}${runner.lastname?.[0] ?? ""}`.toUpperCase();
  return (
    <div className={raceStyles.participantRow}>
      <div className={raceStyles.participantAvatar}>
        {runner.profileImage ? (
          <img src={runner.profileImage} alt={initials} />
        ) : (
          initials || "?"
        )}
      </div>
      <div className={raceStyles.participantMeta}>
        <span className={raceStyles.participantName}>
          {runner.firstname ?? ""} {runner.lastname ?? ""}
        </span>
        <span className={raceStyles.participantEmail}>
          {runner.email ?? "—"}
        </span>
      </div>
      <span
        className={`${raceStyles.statusBadge} ${raceStyles.statusCompleted}`}
      >
        Inscrit
      </span>
    </div>
  );
};

// ─── Carte de course (organisateur) ──────────────
const OrganizerRaceCard = ({ race, onSelect, isLoading }) => {
  const [open, setOpen] = useState(false);
  const status = computeStatus(race.startDate, race.endDate);
  const runners = Array.isArray(race.runners) ? race.runners : [];

  return (
    <div className={`${raceStyles.raceCard} ${raceStyles.raceCardOrg}`}>
      {/* Zone dépliable — div pour éviter le bouton imbriqué */}
      <div
        role="button"
        tabIndex={0}
        className={raceStyles.raceCardToggle}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
      >
        <div className={raceStyles.raceCardTop}>
          <div className={raceStyles.raceMeta}>
            <span className={raceStyles.raceName}>{race.name}</span>
            <span className={raceStyles.raceOrg}>
              {race.organization?.name ?? "Organisation inconnue"}
            </span>
          </div>
          <div className={raceStyles.raceCardActions}>
            <StatusBadge status={status} />
            <span className={raceStyles.participantCount}>
              <IcoUsers />
              {runners.length}
            </span>
            {onSelect && (
              <button
                type="button"
                className={`${raceStyles.mapBtn} ${
                  isLoading ? raceStyles.mapBtnLoading : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                title="Voir sur la carte"
              >
                {isLoading ? (
                  <span className={raceStyles.cardSpinner} />
                ) : (
                  <IcoMapPin />
                )}
                {!isLoading && "Carte"}
              </button>
            )}
            <span
              className={`${raceStyles.chevron} ${open ? raceStyles.chevronOpen : ""}`}
            >
              <IcoChevron />
            </span>
          </div>
        </div>
        <div className={raceStyles.raceCardBottom}>
          <span className={raceStyles.raceDateItem}>
            <IcoCalendar />
            {fmtDate(race.startDate)}
          </span>
          {race.endDate && (
            <span className={raceStyles.raceDateItem}>
              <IcoFlag />
              {fmtDate(race.endDate)}
            </span>
          )}
        </div>
      </div>

      {/* Participants panel */}
      {open && (
        <div className={raceStyles.participantsPanel}>
          <div className={raceStyles.participantsPanelHeader}>
            <span>Participants inscrits</span>
            <span className={raceStyles.participantCountBadge}>
              {runners.length}
            </span>
          </div>

          {runners.length === 0 ? (
            <div className={raceStyles.participantsEmpty}>
              <IcoUsers />
              <span>Aucun participant pour l'instant</span>
            </div>
          ) : (
            <div className={raceStyles.participantsList}>
              {runners.map((runner, i) => {
                // Le runner peut être un objet populé ou juste un ID string
                if (typeof runner === "object" && runner !== null) {
                  return (
                    <ParticipantRow key={runner._id ?? i} runner={runner} />
                  );
                }
                return (
                  <div key={i} className={raceStyles.participantRow}>
                    <div className={raceStyles.participantAvatar}>?</div>
                    <span className={raceStyles.participantEmail}>
                      {runner}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Panel principal ──────────────────────────────
const PanelRaces = ({ user, onSelectRace }) => {
  const { token } = useAuth();
  const role = user?.role ?? "coureur";

  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const handleCardClick = useCallback(
    async (raceId) => {
      if (loadingId || !onSelectRace) return;
      setLoadingId(raceId);
      try {
        const fullRace = await fetchRace(raceId, token);
        console.log("🏁 Course sélectionnée:", fullRace);
        onSelectRace(fullRace);
      } catch (err) {
        console.error("Erreur chargement course:", err);
      } finally {
        setLoadingId(null);
      }
    },
    [loadingId, onSelectRace, token],
  );

  const loadRaces = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (role === "coureur") {
        const data = await fetchMyRaces(token);
        setRaces(data.races ?? []);
      } else if (role === "organisateur") {
        const all = await fetchAllRaces();
        const mine = all.filter(
          (r) =>
            r.owner?._id === user?._id ||
            r.owner === user?._id ||
            r.owner?.toString?.() === user?._id?.toString?.(),
        );
        setRaces(mine);
      }
    } catch (err) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [role, token, user?._id]);

  useEffect(() => {
    loadRaces();
  }, [loadRaces]);

  const titleLabel = role === "organisateur" ? "Mes événements" : "Mes courses";
  const accentWord = role === "organisateur" ? "créés" : "inscrites";

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <span className={styles.tag}>— Courses</span>
        <h2 className={styles.panelTitle}>
          {titleLabel} <span className={styles.accent}>{accentWord}</span>
        </h2>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className={raceStyles.loader}>
          <span />
          <span />
          <span />
          <p>Chargement des courses…</p>
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <IcoWarning />
          </div>
          <p>{error}</p>
          <button
            type="button"
            className={raceStyles.retryBtn}
            onClick={loadRaces}
          >
            Réessayer
          </button>
        </div>
      ) : races.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <IcoFlag />
          </div>
          <p>
            {role === "organisateur"
              ? "Tu n'as pas encore créé de course.\nUtilise l'application mobile pour créer ton premier événement."
              : "Tu n'es inscrit à aucune course pour l'instant.\nRejoins une course depuis l'application mobile."}
          </p>
        </div>
      ) : (
        <div className={raceStyles.racesList}>
          {/* Résumé */}
          <div className={raceStyles.summary}>
            <div className={raceStyles.summaryItem}>
              <span className={raceStyles.summaryValue}>{races.length}</span>
              <span className={raceStyles.summaryLabel}>
                {role === "organisateur" ? "Course(s) créée(s)" : "Course(s)"}
              </span>
            </div>
            {role === "organisateur" && (
              <>
                <div className={raceStyles.summaryItem}>
                  <span className={raceStyles.summaryValue}>
                    {races.reduce(
                      (acc, r) => acc + (r.runners?.length ?? 0),
                      0,
                    )}
                  </span>
                  <span className={raceStyles.summaryLabel}>
                    Participant(s)
                  </span>
                </div>
                <div className={raceStyles.summaryItem}>
                  <span className={raceStyles.summaryValue}>
                    {
                      races.filter(
                        (r) =>
                          computeStatus(r.startDate, r.endDate) === "upcoming",
                      ).length
                    }
                  </span>
                  <span className={raceStyles.summaryLabel}>À venir</span>
                </div>
              </>
            )}
            {role === "coureur" && (
              <>
                <div className={raceStyles.summaryItem}>
                  <span className={raceStyles.summaryValue}>
                    {
                      races.filter(
                        (r) =>
                          (r.status ??
                            computeStatus(r.startDate, r.endDate)) ===
                          "completed",
                      ).length
                    }
                  </span>
                  <span className={raceStyles.summaryLabel}>Terminée(s)</span>
                </div>
                <div className={raceStyles.summaryItem}>
                  <span className={raceStyles.summaryValue}>
                    {
                      races.filter(
                        (r) =>
                          (r.status ??
                            computeStatus(r.startDate, r.endDate)) ===
                          "upcoming",
                      ).length
                    }
                  </span>
                  <span className={raceStyles.summaryLabel}>À venir</span>
                </div>
              </>
            )}
          </div>

          {/* Liste */}
          {role === "organisateur"
            ? races.map((r) => (
                <OrganizerRaceCard
                  key={r._id}
                  race={r}
                  onSelect={
                    onSelectRace ? () => handleCardClick(r._id) : undefined
                  }
                  isLoading={loadingId === r._id}
                />
              ))
            : races.map((r) => (
                <RunnerRaceCard
                  key={r._id}
                  race={r}
                  onSelect={
                    onSelectRace ? () => handleCardClick(r._id) : undefined
                  }
                  isLoading={loadingId === r._id}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default PanelRaces;

// ─── Icônes inline ────────────────────────────────
const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IcoFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);
const IcoRoute = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);
const IcoUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IcoWarning = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IcoMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
