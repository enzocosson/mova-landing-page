import styles from "./Features.module.scss";
import { IconGPS, IconHistory, IconLive, IconRanking } from "../shared/Icons";

const FEATURES = [
  {
    icon: <IconGPS />,
    title: "GPS Précis",
    stat: "< 2m",
    statLabel: "Précision",
    desc: "Suivi temps réel pour chaque participant sur l'intégralité du parcours, à la seconde près.",
  },
  {
    icon: <IconHistory />,
    title: "Historiques & Stats",
    stat: "∞",
    statLabel: "Courses archivées",
    desc: "Analysez vos performances passées, comparez vos allures et visualisez votre progression.",
  },
  {
    icon: <IconLive />,
    title: "Suivi à Distance",
    stat: "0",
    statLabel: "Délai de diffusion",
    desc: "Proches et supporters suivent le coureur en direct sur une carte interactive.",
  },
  {
    icon: <IconRanking />,
    title: "Classement Live",
    stat: "10s",
    statLabel: "Fréquence de maj",
    desc: "Le classement se met à jour toutes les 10 secondes pendant toute la course.",
  },
];

const Features = () => (
  <section className={styles.section}>
    <div className={styles.header} data-reveal>
      <span className={styles.tag}>— Fonctionnalités</span>
      <h2>
        Tout ce qu'il faut pour
        <br />
        <span className={styles.accent}>une course parfaite</span>
      </h2>
    </div>
    <div className={styles.grid}>
      {FEATURES.map((f, i) => (
        <div
          key={i}
          className={styles.card}
          data-reveal
          style={{ transitionDelay: `${i * 0.08}s` }}
        >
          <div className={styles.cardTop}>
            <div className={styles.icon}>{f.icon}</div>
            <div className={styles.stat}>
              <span className={styles.statVal}>{f.stat}</span>
              <span className={styles.statLbl}>{f.statLabel}</span>
            </div>
          </div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
          <div className={styles.cardLine} />
        </div>
      ))}
    </div>
  </section>
);

export default Features;
