const IlluStats = () => {
  const bars = [62, 78, 55, 88, 70, 95, 83];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {[0, 45, 90, 135].map((y, i) => (
        <line
          key={i}
          x1="30"
          y1={y + 10}
          x2="310"
          y2={y + 10}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}
      <path
        d={`M40 ${148 - bars[0]} C60 ${148 - bars[0]} 60 ${148 - bars[1]} 80 ${148 - bars[1]} C100 ${148 - bars[1]} 100 ${148 - bars[2]} 120 ${148 - bars[2]} C140 ${148 - bars[2]} 140 ${148 - bars[3]} 160 ${148 - bars[3]} C180 ${148 - bars[3]} 180 ${148 - bars[4]} 200 ${148 - bars[4]} C220 ${148 - bars[4]} 220 ${148 - bars[5]} 240 ${148 - bars[5]} C260 ${148 - bars[5]} 260 ${148 - bars[6]} 280 ${148 - bars[6]} L280 148 L40 148 Z`}
        fill="url(#statsGrad)"
        opacity="0.3"
      />
      <defs>
        <linearGradient id="statsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a1f763" />
          <stop offset="100%" stopColor="#a1f763" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M40 ${148 - bars[0]} C60 ${148 - bars[0]} 60 ${148 - bars[1]} 80 ${148 - bars[1]} C100 ${148 - bars[1]} 100 ${148 - bars[2]} 120 ${148 - bars[2]} C140 ${148 - bars[2]} 140 ${148 - bars[3]} 160 ${148 - bars[3]} C180 ${148 - bars[3]} 180 ${148 - bars[4]} 200 ${148 - bars[4]} C220 ${148 - bars[4]} 220 ${148 - bars[5]} 240 ${148 - bars[5]} C260 ${148 - bars[5]} 260 ${148 - bars[6]} 280 ${148 - bars[6]}`}
        stroke="#a1f763"
        strokeWidth="1.5"
      />
      {bars.map((b, i) => (
        <circle key={i} cx={40 + i * 40} cy={148 - b} r="3" fill="#a1f763" />
      ))}
      <circle cx="240" cy={148 - bars[5]} r="5" fill="#a1f763" opacity="0.2" />
      <circle cx="240" cy={148 - bars[5]} r="3" fill="#a1f763" />
      <rect
        x="218"
        y={148 - bars[5] - 32}
        width="46"
        height="22"
        fill="#1a1a1a"
        stroke="rgba(161,247,99,0.3)"
        strokeWidth="1"
      />
      <text
        x="241"
        y={148 - bars[5] - 17}
        fill="#a1f763"
        fontSize="9"
        fontFamily="monospace"
        textAnchor="middle"
        fontWeight="bold"
      >
        4'32"/km
      </text>
      {days.map((d, i) => (
        <text
          key={i}
          x={40 + i * 40}
          y="165"
          fill="rgba(255,255,255,0.2)"
          fontSize="9"
          fontFamily="monospace"
          textAnchor="middle"
        >
          {d}
        </text>
      ))}
    </svg>
  );
};

export default IlluStats;
