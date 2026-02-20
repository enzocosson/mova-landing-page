const NoiseBg = () => (
  <svg
    style={{
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 999,
      opacity: 0.35,
      mixBlendMode: "overlay",
    }}
    xmlns="http://www.w3.org/2000/svg"
    width="300"
    height="300"
  >
    <filter id="n">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="4"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="300" height="300" filter="url(#n)" opacity="0.08" />
  </svg>
);

export default NoiseBg;
