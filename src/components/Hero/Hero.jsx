import { useEffect, useRef } from "react";
import styles from "./Hero.module.scss";
import IlluMap from "../shared/IlluMap";
import { IconArrow, IconApple, IconGoogle } from "../shared/Icons";

const RANKING = [
  { pos: "1.", name: "Thomas M.", time: "42:18" },
  { pos: "2.", name: "Lucas D.", time: "42:55" },
  { pos: "3.", name: "Sara K.", time: "43:10" },
];

const Hero = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!contentRef.current) return;
      const y = window.scrollY;
      contentRef.current.style.transform = `translateY(${y * 0.25}px)`;
      contentRef.current.style.opacity = String(Math.max(0, 1 - y / 700));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.grid} />
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div ref={contentRef} className={styles.content}>
        <div className={styles.badge}>— Suivi GPS en temps réel —</div>

        <h1 className={styles.title}>
          La course,
          <br />
          <span className={styles.accent}>réinventée.</span>
        </h1>

        <p className={styles.sub}>
          Mova connecte coureurs, spectateurs et organisateurs dans une
          expérience immersive — GPS live, classement instantané, stats
          avancées.
        </p>

        {/* CTAs principaux */}
        <div className={styles.ctas}>
          <a href="#" className={styles.btnPrimary}>
            <span>Commencer maintenant</span>
            <IconArrow />
          </a>
          <a href="#" className={styles.btnGhost}>
            Voir la démo
          </a>
        </div>

        {/* Séparateur */}
        <div className={styles.storeDivider}>
          <span className={styles.storeDividerLine} />
          <span className={styles.storeDividerText}>Disponible sur</span>
          <span className={styles.storeDividerLine} />
        </div>

        {/* Store buttons */}
        <div className={styles.storeButtons}>
          {/* Apple — fond blanc */}
          <a href="#" className={styles.storeBtnApple}>
            <IconApple />
            <div className={styles.storeBtnText}>
              <span className={styles.storeSub}>Télécharger sur</span>
              <span className={styles.storeMain}>App Store</span>
            </div>
          </a>

          {/* Google — fond outline */}
          <a href="#" className={styles.storeBtnGoogle}>
            <IconGoogle />
            <div className={styles.storeBtnText}>
              <span className={styles.storeSub}>Disponible sur</span>
              <span className={styles.storeMain}>Google Play</span>
            </div>
          </a>
        </div>
      </div>

      <div className={styles.illu} data-reveal>
        <div className={styles.mapWrap}>
          <IlluMap />
          <div className={styles.mapOverlay}>
            <div className={styles.mapCard}>
              <span className={styles.mapCardLabel}>Classement Live</span>
              {RANKING.map((r) => (
                <div key={r.pos} className={styles.mapRow}>
                  <span className={styles.mapPos}>{r.pos}</span>
                  <span className={styles.mapName}>{r.name}</span>
                  <span className={styles.mapTime}>{r.time}</span>
                </div>
              ))}
            </div>
            <div className={styles.mapBadge}>
              <span className={styles.liveDot} />
              <span>78 coureurs en direct</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
};

export default Hero;
