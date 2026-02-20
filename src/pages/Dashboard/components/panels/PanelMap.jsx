import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Panels.module.scss";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── Helpers GPX ──────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const parseGpxText = (text) => {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    // Vérifie si le parsing a échoué
    const parseError = xml.querySelector("parsererror");
    if (parseError) {
      console.error("[GPX] Erreur parsing XML:", parseError.textContent);
      return [];
    }

    // getElementsByTagName est insensible aux namespaces XML (contrairement à querySelectorAll)
    let trkpts = xml.getElementsByTagName("trkpt");
    if (trkpts.length === 0) trkpts = xml.getElementsByTagName("rtept");
    if (trkpts.length === 0) trkpts = xml.getElementsByTagName("wpt");

    const points = Array.from(trkpts)
      .map((pt) => [
        parseFloat(pt.getAttribute("lat")),
        parseFloat(pt.getAttribute("lon")),
      ])
      .filter((p) => !isNaN(p[0]) && !isNaN(p[1]));

    console.log(
      "[GPX] Balises trouvées:",
      trkpts.length,
      "→ points valides:",
      points.length,
    );
    return points;
  } catch (err) {
    console.error("[GPX] Exception parsing:", err);
    return [];
  }
};

const loadGpxPoints = async (gpxFile) => {
  if (!gpxFile) return [];
  try {
    const val = typeof gpxFile === "string" ? gpxFile.trim() : "";
    if (!val) return [];

    let text;

    // Cas 1 : URL complète
    if (val.startsWith("http://") || val.startsWith("https://")) {
      const res = await fetch(val);
      text = await res.text();
    }
    // Cas 2 : chemin relatif stocké sur le serveur (ex: "uploads/gpx/file.gpx")
    else if (val.startsWith("uploads/") || val.endsWith(".gpx")) {
      const url = `${API_URL}/${val.replace(/^\//, "")}`;
      console.log("[GPX] Fetch chemin relatif:", url);
      const res = await fetch(url);
      text = await res.text();
    }
    // Cas 3 : contenu XML brut
    else {
      console.log("[GPX] Parse XML brut, longueur:", val.length);
      text = val;
    }

    const points = parseGpxText(text);
    console.log("[GPX] Points parsés:", points.length);
    return points;
  } catch (err) {
    console.error("[GPX] Erreur chargement:", err);
    return [];
  }
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: "", iconRetinaUrl: "", shadowUrl: "" });

const injectMapStyles = () => {
  if (document.getElementById("panelmap-styles")) return;
  const style = document.createElement("style");
  style.id = "panelmap-styles";
  style.textContent = `
    .leaflet-tile { border: 0 !important; outline: 0 !important; }
    .leaflet-tile-container img { image-rendering: -webkit-optimize-contrast; }
    .leaflet-container { background: #0f0f0f !important; }
    .leaflet-attribution-flag { display: none !important; }

    @keyframes userPulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      50%  { transform: scale(2.4); opacity: 0; }
      100% { transform: scale(1);   opacity: 0; }
    }
    .user-marker {
      position: relative; width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
    }
    .user-dot {
      position: absolute; inset: 0;
      background: #a1f763; border: 3px solid #080808; border-radius: 50%;
      z-index: 2; box-shadow: 0 0 0 3px rgba(161,247,99,0.3);
    }
    .user-ring {
      position: absolute; inset: -6px;
      border: 2px solid #a1f763; border-radius: 50%;
      animation: userPulse 2.2s ease-out infinite;
      z-index: 1; pointer-events: none;
    }
    .user-ring-2 {
      position: absolute; inset: -6px;
      border: 2px solid #a1f763; border-radius: 50%;
      animation: userPulse 2.2s ease-out infinite 0.7s;
      z-index: 1; pointer-events: none;
    }
    .user-label {
      position: absolute; top: -36px; left: 50%;
      transform: translateX(-50%);
      background: rgba(8,8,8,0.92);
      border: 1px solid rgba(161,247,99,0.3);
      color: #a1f763; font-size: 10px; font-weight: 700;
      font-family: Inter, sans-serif; letter-spacing: 0.1em;
      text-transform: uppercase; padding: 4px 10px; white-space: nowrap;
      pointer-events: none;
    }
    .user-label::after {
      content: ''; position: absolute; bottom: -5px; left: 50%;
      transform: translateX(-50%);
      width: 1px; height: 5px; background: rgba(161,247,99,0.4);
    }
  `;
  document.head.appendChild(style);
};

const DEFAULT_POS = [48.8566, 2.3522]; // Paris fallback

const PanelMap = ({ user, race, onClearRace }) => {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markerRef = useRef(null);
  const gpxLayerRef = useRef(null);
  const coordsRef = useRef(null);
  const mapFocusRef = useRef("user");
  const [status, setStatus] = useState("loading"); // loading | ok | denied | unavailable
  const [coords, setCoords] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [gpxStatus, setGpxStatus] = useState(null); // null | "loading" | "ok" | "none"
  // Si une course est déjà présente à l'ouverture, on démarre en focus "race"
  const [mapFocus, setMapFocus] = useState(race ? "race" : "user");
  const firstName = user?.firstname ?? "Vous";

  // Synchronise la ref avec le state via effect (pas dans le render body)
  useEffect(() => {
    mapFocusRef.current = mapFocus;
  }, [mapFocus]);

  const handleFocusUser = () => {
    mapFocusRef.current = "user";
    setMapFocus("user");
    if (mapInst.current) {
      const target = coordsRef.current
        ? [coordsRef.current.lat, coordsRef.current.lng]
        : DEFAULT_POS;
      mapInst.current.setView(target, 15, { animate: true });
    }
  };

  const handleFocusRace = () => {
    mapFocusRef.current = "race";
    setMapFocus("race");
    if (mapInst.current && gpxLayerRef.current) {
      mapInst.current.fitBounds(gpxLayerRef.current.getBounds(), {
        padding: [60, 60],
      });
    }
  };

  // ── Init map ──────────────────────────────────
  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    injectMapStyles();

    const map = L.map(mapRef.current, {
      center: DEFAULT_POS,
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: true,
      dragging: true,
      doubleClickZoom: true,
      attributionControl: false,
    });

    mapInst.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        detectRetina: true,
      },
    ).addTo(map);

    requestAnimationFrame(() => {
      map.invalidateSize();
      setMapReady(true);
    });

    return () => {
      map.remove();
      mapInst.current = null;
      markerRef.current = null;
      gpxLayerRef.current = null;
    };
  }, []);

  // ── Géolocalisation ───────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    const onSuccess = (pos) => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      setCoords({ lat, lng, accuracy });
      coordsRef.current = { lat, lng };
      setStatus("ok");

      const map = mapInst.current;
      if (!map) return;

      // Centre la map seulement si le focus est sur la position utilisateur
      if (mapFocusRef.current === "user") {
        map.setView([lat, lng], 15, { animate: true });
      }

      // Crée ou déplace le marqueur
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: L.divIcon({
            html: `
              <div class="user-marker">
                <div class="user-ring"></div>
                <div class="user-ring-2"></div>
                <div class="user-dot"></div>
                <div class="user-label">${firstName}</div>
              </div>
            `,
            className: "",
            iconAnchor: [16, 16],
            iconSize: [32, 32],
          }),
          zIndexOffset: 1000,
        }).addTo(map);
      }

      // Cercle de précision
      L.circle([lat, lng], {
        radius: accuracy,
        color: "#a1f763",
        fillColor: "#a1f763",
        fillOpacity: 0.04,
        weight: 1,
        opacity: 0.3,
        dashArray: "4 4",
      }).addTo(map);
    };

    const onError = (err) => {
      if (err.code === 1) setStatus("denied");
      else setStatus("unavailable");

      // Fallback Paris avec marqueur grisé
      const map = mapInst.current;
      if (!map) return;
      L.marker(DEFAULT_POS, {
        icon: L.divIcon({
          html: `
            <div class="user-marker">
              <div class="user-dot" style="background:#333; border-color:#080808;"></div>
              <div class="user-label" style="color:#555; border-color:rgba(255,255,255,0.1);">
                ${firstName}
              </div>
            </div>
          `,
          className: "",
          iconAnchor: [16, 16],
          iconSize: [32, 32],
        }),
      }).addTo(map);
    };

    // Première position rapide
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    });

    // Mise à jour continue
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ── Tracé GPX de la course ────────────────────
  useEffect(() => {
    if (!mapReady || !mapInst.current) return;

    // Retirer l'ancien tracé
    if (gpxLayerRef.current) {
      gpxLayerRef.current.remove();
      gpxLayerRef.current = null;
    }

    if (!race) {
      setGpxStatus(null);
      setMapFocus("user");
      if (mapInst.current && coordsRef.current) {
        mapInst.current.setView(
          [coordsRef.current.lat, coordsRef.current.lng],
          15,
          { animate: true },
        );
      }
      return;
    }

    if (!race.gpxFile) {
      setGpxStatus("none");
      return;
    }

    // Verrouiller le focus sur la course AVANT le chargement async
    // pour que la géolocalisation ne reprenne pas la main pendant ce temps
    setMapFocus("race");
    mapFocusRef.current = "race";
    setGpxStatus("loading");

    const draw = async () => {
      console.log("[GPX] race.gpxFile:", race.gpxFile);
      const points = await loadGpxPoints(race.gpxFile);
      if (!mapInst.current) return;

      if (points.length < 2) {
        setGpxStatus("none");
        return;
      }

      const polyline = L.polyline(points, {
        color: "#a1f763",
        weight: 4,
        opacity: 0.9,
      });
      polyline.addTo(mapInst.current);
      gpxLayerRef.current = polyline;

      // Marqueur départ
      L.circleMarker(points[0], {
        radius: 7,
        color: "#a1f763",
        fillColor: "#a1f763",
        fillOpacity: 1,
        weight: 2,
      })
        .bindTooltip("Départ", { permanent: false })
        .addTo(mapInst.current);

      // Marqueur arrivée
      L.circleMarker(points[points.length - 1], {
        radius: 7,
        color: "#f76363",
        fillColor: "#f76363",
        fillOpacity: 1,
        weight: 2,
      })
        .bindTooltip("Arrivée", { permanent: false })
        .addTo(mapInst.current);

      mapInst.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });
      setGpxStatus("ok");
    };

    draw().catch(() => setGpxStatus("none"));
  }, [race, mapReady]);

  return (
    <div className={styles.panelMapFull}>
      {/* Carte en base — tous les overlays sont par-dessus */}
      <div ref={mapRef} style={{ position: "absolute", inset: 0 }} />

      {/* Badge statut */}
      <div className={styles.mapOverlayBadge}>
        <span
          className={styles.mapLiveDot}
          style={{
            background:
              status === "ok"
                ? "#a1f763"
                : status === "loading"
                  ? "#f7c663"
                  : "#f76363",
          }}
        />
        {status === "loading" && "Localisation en cours…"}
        {status === "ok" && "Position en direct"}
        {status === "denied" && "Accès refusé — position approchée"}
        {status === "unavailable" && "GPS indisponible"}
      </div>

      {/* Coordonnées */}
      <div className={styles.mapOverlayCoords}>
        {coords
          ? `${coords.lat.toFixed(5)}° N  ·  ${coords.lng.toFixed(5)}° E`
          : "Acquisition GPS…"}
      </div>

      {/* Précision */}
      {coords?.accuracy && (
        <div className={styles.mapOverlayAccuracy}>
          ± {Math.round(coords.accuracy)} m
        </div>
      )}

      {/* Course sélectionnée */}
      {race && (
        <div className={styles.raceMapOverlay}>
          <div className={styles.raceMapOverlayHeader}>
            <span className={styles.raceMapOverlayName}>{race.name}</span>
            {onClearRace && (
              <button
                type="button"
                className={styles.raceMapOverlayClose}
                onClick={onClearRace}
                title="Fermer"
              >
                ✕
              </button>
            )}
          </div>
          <div className={styles.raceMapOverlayMeta}>
            <div className={styles.raceMapOverlayRow}>
              <IcoCalMap />
              {fmtDate(race.startDate)}
              {race.endDate && ` → ${fmtDate(race.endDate)}`}
            </div>
            <div className={styles.raceMapOverlayRow}>
              <IcoUsersMap />
              {Array.isArray(race.runners) ? race.runners.length : 0}{" "}
              participant(s)
            </div>
            {race.distance && (
              <div className={styles.raceMapOverlayRow}>
                <IcoRouteMap />
                {race.distance} km
              </div>
            )}
          </div>
          <div
            className={`${styles.raceMapOverlayGpx} ${
              gpxStatus === "ok"
                ? styles.raceMapOverlayGpxOk
                : styles.raceMapOverlayGpxNone
            }`}
          >
            <span
              className={styles.raceMapOverlayGpxDot}
              style={{
                background:
                  gpxStatus === "ok"
                    ? "#a1f763"
                    : gpxStatus === "loading"
                      ? "#f7c663"
                      : "#444",
              }}
            />
            {gpxStatus === "loading" && "Chargement du tracé…"}
            {gpxStatus === "ok" && "Tracé GPX chargé"}
            {gpxStatus === "none" && "Tracé GPX non disponible"}
            {!gpxStatus && "—"}
          </div>
        </div>
      )}

      {/* ── Switch focus ──────────────────────────── */}
      <div className={styles.mapFocusSwitch}>
        <button
          type="button"
          className={[
            styles.mapSwitchOption,
            mapFocus === "user" ? styles.mapSwitchOptionActive : "",
            status === "denied" || status === "unavailable"
              ? styles.mapSwitchOptionDenied
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={handleFocusUser}
          title={
            status === "ok"
              ? "Centrer sur ma position"
              : status === "denied"
                ? "Géolocalisation refusée"
                : "GPS indisponible"
          }
        >
          <IcoLocateMap />
          Ma position
        </button>
        {race && gpxStatus === "ok" && (
          <button
            type="button"
            className={`${styles.mapSwitchOption} ${
              mapFocus === "race" ? styles.mapSwitchOptionActive : ""
            }`}
            onClick={handleFocusRace}
            title="Centrer sur le tracé"
          >
            <IcoTraceMap />
            Tracé
          </button>
        )}
        {race && gpxStatus === "ok" && (
          <span
            className={styles.mapSwitchThumb}
            style={{
              transform:
                mapFocus === "race" ? "translateX(100%)" : "translateX(0%)",
            }}
          />
        )}
      </div>
    </div>
  );
};

// ─── Icônes overlay course ────────────────────────
const IcoCalMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IcoUsersMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoRouteMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);
const IcoTraceMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IcoLocateMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

export default PanelMap;
