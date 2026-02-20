import { useEffect, useRef } from "react";
import styles from "./PhotoBanner.module.scss";

const STATS = [
  { val: "12 400+", lbl: "Coureurs actifs" },
  { val: "340", lbl: "Courses organisées" },
  { val: "98%", lbl: "Satisfaction" },
];

const PhotoBanner = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          contentRef.current.style.cssText =
            "opacity:1;transform:translateY(0)";
      },
      { threshold: 0.2 },
    );
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.imgWrap}>
        <img
          src="/assets/images/race-banner.png"
          alt="Coureurs en compétition"
          className={styles.img}
        />
      </div>
      <div className={styles.overlay} />
      <div ref={contentRef} className={styles.content}>
        <span className={styles.tag}>— Ils courent avec Mova</span>
        <h2 className={styles.title}>
          La course,
          <br />
          <span className={styles.accent}>vécue autrement.</span>
        </h2>
        <p className={styles.sub}>
          Des milliers de coureurs, spectateurs et organisateurs font confiance
          à Mova pour vivre chaque événement intensément.
        </p>
        <div className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.lbl} className={styles.stat}>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLbl}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoBanner;
