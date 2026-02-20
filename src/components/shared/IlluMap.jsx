import { useEffect, useRef, useState } from "react";

const ROUTE = [
  [48.853, 2.349],
  [48.8545, 2.352],
  [48.856, 2.3555],
  [48.8575, 2.354],
  [48.859, 2.357],
  [48.861, 2.36],
  [48.8625, 2.363],
  [48.864, 2.361],
  [48.8655, 2.365],
];

const TOP_RUNNERS = [
  {
    id: 1,
    pos: [48.859, 2.357],
    label: "1",
    delay: "0s",
    name: "Thomas M.",
    pace: "4'13\"",
    bpm: 168,
    dist: "8.2 km",
    time: "34:42",
    rank: 1,
  },
  {
    id: 2,
    pos: [48.8575, 2.354],
    label: "2",
    delay: "0.4s",
    name: "Lucas D.",
    pace: "4'17\"",
    bpm: 172,
    dist: "8.0 km",
    time: "34:16",
    rank: 2,
  },
  {
    id: 3,
    pos: [48.856, 2.3555],
    label: "3",
    delay: "0.8s",
    name: "Sara K.",
    pace: "4'22\"",
    bpm: 161,
    dist: "7.8 km",
    time: "34:03",
    rank: 3,
  },
];

// Positionnés AVANT les top 3 sur le parcours (indices 0→3)
const EXTRA_RUNNERS = [
  {
    id: 10,
    pos: [48.8533, 2.3495],
    rank: 4,
    pace: "4'28\"",
    bpm: 158,
    dist: "7.4 km",
    time: "33:07",
  },
  {
    id: 11,
    pos: [48.8538, 2.3502],
    rank: 5,
    pace: "4'31\"",
    bpm: 155,
    dist: "7.2 km",
    time: "32:33",
  },
  {
    id: 12,
    pos: [48.8543, 2.3512],
    rank: 6,
    pace: "4'33\"",
    bpm: 162,
    dist: "7.1 km",
    time: "32:20",
  },
  {
    id: 13,
    pos: [48.8548, 2.3522],
    rank: 7,
    pace: "4'35\"",
    bpm: 149,
    dist: "7.0 km",
    time: "32:05",
  },
  {
    id: 14,
    pos: [48.8552, 2.3532],
    rank: 8,
    pace: "4'38\"",
    bpm: 153,
    dist: "6.9 km",
    time: "31:58",
  },
  {
    id: 15,
    pos: [48.8556, 2.3542],
    rank: 9,
    pace: "4'40\"",
    bpm: 160,
    dist: "6.8 km",
    time: "31:44",
  },
  {
    id: 16,
    pos: [48.8536, 2.3506],
    rank: 10,
    pace: "4'42\"",
    bpm: 147,
    dist: "6.7 km",
    time: "31:29",
  },
  {
    id: 17,
    pos: [48.8541, 2.3516],
    rank: 11,
    pace: "4'45\"",
    bpm: 151,
    dist: "6.5 km",
    time: "30:54",
  },
  {
    id: 18,
    pos: [48.8546, 2.3526],
    rank: 12,
    pace: "4'48\"",
    bpm: 144,
    dist: "6.3 km",
    time: "30:18",
  },
  {
    id: 19,
    pos: [48.8535, 2.35],
    rank: 13,
    pace: "4'50\"",
    bpm: 156,
    dist: "6.1 km",
    time: "29:31",
  },
  {
    id: 20,
    pos: [48.854, 2.351],
    rank: 14,
    pace: "4'53\"",
    bpm: 148,
    dist: "5.9 km",
    time: "28:49",
  },
  {
    id: 21,
    pos: [48.8545, 2.3518],
    rank: 15,
    pace: "4'55\"",
    bpm: 143,
    dist: "5.7 km",
    time: "28:00",
  },
];

const injectStyles = () => {
  if (document.getElementById("illumap-styles")) return;
  const style = document.createElement("style");
  style.id = "illumap-styles";
  style.textContent = `
    .leaflet-tile { border: 0 !important; outline: 0 !important; }
    .leaflet-tile-container img { image-rendering: -webkit-optimize-contrast; }
    .leaflet-container { background: #0f0f0f !important; }

    @keyframes mapPulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      50%  { transform: scale(1.8); opacity: 0; }
      100% { transform: scale(1);   opacity: 0; }
    }
    @keyframes mapBlink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.25; }
    }

    /* ── Top 3 ── */
    .runner-marker { position: relative; width: 26px; height: 26px; cursor: pointer; z-index: 10 !important; }
    .runner-dot {
      position: absolute; inset: 0;
      background: #a1f763; border: 2px solid #080808; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; color: #080808;
      font-family: Inter, sans-serif; z-index: 10;
      transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
    }
    .runner-marker:hover .runner-dot { transform: scale(1.25); }
    .runner-dot.active { background: #fff !important; box-shadow: 0 0 0 3px #a1f763; }
    .runner-ring {
      position: absolute; inset: -4px;
      border: 2px solid #a1f763; border-radius: 50%;
      animation: mapPulse 2s ease-out infinite; z-index: 9; pointer-events: none;
    }
    .runner-ring-2 {
      position: absolute; inset: -4px;
      border: 2px solid #a1f763; border-radius: 50%;
      animation: mapPulse 2s ease-out infinite 0.6s; z-index: 9; pointer-events: none;
    }

    /* ── Extra dots — z-index bas pour passer derrière les top 3 ── */
    .extra-wrap {
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      width: 20px; height: 20px;
      z-index: 1 !important;
    }
    .extra-inner {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(161,247,99,0.3);
      border: 1px solid rgba(161,247,99,0.5);
      transition: width 0.25s cubic-bezier(0.16,1,0.3,1),
                  height 0.25s cubic-bezier(0.16,1,0.3,1),
                  background 0.25s, box-shadow 0.25s;
    }
    .extra-wrap:hover .extra-inner {
      width: 14px; height: 14px;
      background: rgba(161,247,99,0.6);
    }
    .extra-inner.active {
      width: 18px !important; height: 18px !important;
      background: #a1f763 !important;
      border-color: #a1f763 !important;
      box-shadow: 0 0 0 4px rgba(161,247,99,0.25), 0 0 12px rgba(161,247,99,0.4);
    }

    /* ── Start / End ── */
    .start-marker {
      width: 30px; height: 30px; background: #a1f763;
      border: 2px solid #080808; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 800; color: #080808;
      font-family: Inter, sans-serif;
      box-shadow: 0 0 12px rgba(161,247,99,0.4);
    }
    .end-marker {
      width: 30px; height: 30px; background: transparent;
      border: 2px solid rgba(255,255,255,0.3); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.4);
      font-family: Inter, sans-serif;
    }

    /* ── Live badge ── */
    .live-badge {
      background: rgba(8,8,8,0.9); border: 1px solid rgba(161,247,99,0.3);
      padding: 5px 10px; display: flex; align-items: center; gap: 6px;
      font-size: 10px; font-weight: 700; color: #a1f763;
      font-family: Inter, sans-serif; letter-spacing: 0.1em; text-transform: uppercase;
    }
    .live-dot-badge {
      width: 5px; height: 5px; background: #a1f763; border-radius: 50%;
      animation: mapBlink 1.2s ease-in-out infinite; flex-shrink: 0;
    }

    /* Force z-index Leaflet layers */
    .leaflet-marker-pane { z-index: 600; }
  `;
  document.head.appendChild(style);
};

export default function IlluMap() {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const [selected, setSelected] = useState(TOP_RUNNERS[0]);
  const [extraSelected, setExtraSelected] = useState(null);

  const handleTopSelect = (runner) => {
    setExtraSelected(null);
    setSelected((prev) => (prev?.id === runner.id ? null : runner));
  };

  const handleExtraSelect = (runner) => {
    setSelected(null);
    setExtraSelected((prev) => (prev?.id === runner.id ? null : runner));
  };

  // Sync top 3 dot classes
  useEffect(() => {
    TOP_RUNNERS.forEach((r) => {
      const dot = document.getElementById(`dot-${r.id}`);
      if (dot) {
        selected?.id === r.id
          ? dot.classList.add("active")
          : dot.classList.remove("active");
      }
    });
  }, [selected]);

  // Sync extra dot classes
  useEffect(() => {
    EXTRA_RUNNERS.forEach((r) => {
      const dot = document.getElementById(`extra-${r.id}`);
      if (dot) {
        extraSelected?.id === r.id
          ? dot.classList.add("active")
          : dot.classList.remove("active");
      }
    });
  }, [extraSelected]);

  useEffect(() => {
    if (instanceRef.current) return;
    injectStyles();

    import("leaflet").then((L) => {
      if (!mapRef.current || instanceRef.current) return;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "",
        iconRetinaUrl: "",
        shadowUrl: "",
      });

      const map = L.map(mapRef.current, {
        center: [48.8592, 2.3575],
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      instanceRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          detectRetina: true,
        },
      ).addTo(map);

      L.polyline(ROUTE, { color: "#a1f763", weight: 3, opacity: 0.85 }).addTo(
        map,
      );

      L.marker(ROUTE[0], {
        icon: L.divIcon({
          html: `<div class="start-marker">D</div>`,
          className: "",
          iconAnchor: [15, 15],
        }),
        zIndexOffset: 500,
      }).addTo(map);

      L.marker(ROUTE[ROUTE.length - 1], {
        icon: L.divIcon({
          html: `<div class="end-marker">A</div>`,
          className: "",
          iconAnchor: [15, 15],
        }),
        zIndexOffset: 500,
      }).addTo(map);

      // Extra dots — zIndexOffset négatif → derrière les top 3
      EXTRA_RUNNERS.forEach((r) => {
        const marker = L.marker(r.pos, {
          icon: L.divIcon({
            html: `<div class="extra-wrap"><div class="extra-inner" id="extra-${r.id}"></div></div>`,
            className: "",
            iconAnchor: [10, 10],
            iconSize: [20, 20],
          }),
          zIndexOffset: -100,
        }).addTo(map);

        marker.on("click", () => handleExtraSelect(r));
      });

      // Top 3 — zIndexOffset positif → devant tout
      TOP_RUNNERS.forEach((r) => {
        const marker = L.marker(r.pos, {
          icon: L.divIcon({
            html: `
              <div class="runner-marker">
                <div class="runner-ring" style="animation-delay:${r.delay}"></div>
                <div class="runner-ring-2" style="animation-delay:calc(${r.delay} + 0.3s)"></div>
                <div class="runner-dot" id="dot-${r.id}">${r.label}</div>
              </div>
            `,
            className: "",
            iconAnchor: [13, 13],
            iconSize: [26, 26],
          }),
          zIndexOffset: 1000,
        }).addTo(map);

        marker.on("click", () => handleTopSelect(r));
      });

      const LiveControl = L.Control.extend({
        options: { position: "bottomleft" },
        onAdd: () => {
          const div = L.DomUtil.create("div");
          div.innerHTML = `<div class="live-badge"><div class="live-dot-badge"></div>78 coureurs en direct</div>`;
          return div;
        },
      });
      new LiveControl().addTo(map);
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, []);

  const activeRunner = selected || extraSelected;
  const isExtra = !selected && !!extraSelected;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: "#0f0f0f",
        fontFamily: "Inter, sans-serif",
        boxShadow:
          "0 0 80px 20px rgba(161, 247, 99, 0.49), 0 0 200px 60px rgba(161, 247, 99, 0.04)",
        borderRadius: "2px",
      }}
    >
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* ── Carte ── */}
        <div ref={mapRef} style={{ flex: 1, height: "380px" }} />

        {/* ── Classement ── */}
        <div
          style={{
            width: "210px",
            flexShrink: 0,
            background: "#0a0a0a",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "0.63rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#666",
              }}
            >
              Classement
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: "0.6rem",
                color: "#a1f763",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#a1f763",
                  display: "inline-block",
                  animation: "mapBlink 1.2s ease-in-out infinite",
                }}
              />
              Live
            </span>
          </div>

          {TOP_RUNNERS.map((r) => {
            const isActive = selected?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => handleTopSelect(r)}
                style={{
                  padding: "11px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  background: isActive
                    ? "rgba(161,247,99,0.06)"
                    : "transparent",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: isActive ? "#a1f763" : "rgba(161,247,99,0.1)",
                    border: `1px solid ${isActive ? "#a1f763" : "rgba(161,247,99,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    color: isActive ? "#080808" : "#a1f763",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {r.rank}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      color: isActive ? "#a1f763" : "#f0f0f0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      transition: "color 0.2s",
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{ fontSize: "0.62rem", color: "#444", marginTop: 2 }}
                  >
                    {r.pace}/km · {r.dist}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#555",
                    flexShrink: 0,
                  }}
                >
                  {r.time}
                </span>
              </div>
            );
          })}

          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                color: "#333",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              75 autres coureurs
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(161,247,99,0.15)",
                    border: "1px solid rgba(161,247,99,0.25)",
                  }}
                />
              ))}
              <span
                style={{
                  fontSize: "0.58rem",
                  color: "#2a2a2a",
                  alignSelf: "center",
                  marginLeft: 2,
                }}
              >
                +59
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "8px 14px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              fontSize: "0.58rem",
              color: "#2a2a2a",
              textAlign: "center",
              letterSpacing: "0.08em",
            }}
          >
            ↻ Actualisation dans 10s
          </div>
        </div>
      </div>

      {/* ── Fiche coureur ── */}
      <div
        style={{
          height: activeRunner ? "110px" : "0px",
          overflow: "hidden",
          transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "#080808",
        }}
      >
        {activeRunner && (
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              height: "100%",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: isExtra
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(161,247,99,0.1)",
                border: `1px solid ${isExtra ? "rgba(255,255,255,0.1)" : "rgba(161,247,99,0.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.78rem",
                fontWeight: 800,
                color: isExtra ? "#444" : "#a1f763",
                flexShrink: 0,
              }}
            >
              {isExtra
                ? `#${activeRunner.rank}`
                : activeRunner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
            </div>
            <div style={{ minWidth: 110 }}>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  marginBottom: 4,
                  color: isExtra ? "#555" : "#f0f0f0",
                }}
              >
                {isExtra ? `Coureur anonyme` : activeRunner.name}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: "0.6rem",
                  color: isExtra ? "#444" : "#a1f763",
                  background: isExtra
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(161,247,99,0.08)",
                  border: `1px solid ${isExtra ? "rgba(255,255,255,0.07)" : "rgba(161,247,99,0.2)"}`,
                  padding: "2px 8px",
                }}
              >
                #{activeRunner.rank} au classement
              </div>
            </div>
            <div style={{ display: "flex", flex: 1 }}>
              {[
                { val: activeRunner.pace + "/km", lbl: "Allure" },
                { val: activeRunner.bpm + " bpm", lbl: "Fréq. card." },
                { val: activeRunner.dist, lbl: "Distance" },
                { val: activeRunner.time, lbl: "Temps" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderLeft: "1px solid rgba(255,255,255,0.07)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: isExtra ? "#555" : "#a1f763",
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: "0.58rem",
                      color: "#333",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginTop: 3,
                    }}
                  >
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSelected(null);
                setExtraSelected(null);
              }}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#444",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "0.8rem",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
