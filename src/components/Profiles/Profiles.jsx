import styles from "./Profiles.module.scss";
import { IconOrganizer, IconSpectator, IconRunner } from "../shared/Icons";

const PROFILES = [
  {
    icon: <IconOrganizer />,
    label: "Organisateurs",
    tag: "Prestige & Visibilité",
    desc: "Attirez plus de coureurs, offrez une expérience professionnelle et renforcez la réputation de votre événement.",
    perks: [
      "Tableau de bord de gestion",
      "Carte du parcours en direct",
      "Export CSV des résultats",
      "Branding personnalisé",
    ],
  },
  {
    icon: <IconSpectator />,
    label: "Spectateurs",
    tag: "Émotions en Direct",
    desc: "Suivez vos proches ou athlètes favoris en temps réel et vivez la course comme si vous y étiez.",
    perks: [
      "Carte GPS interactive",
      "Notifications push",
      "Classement instantané",
      "Mode partage facile",
    ],
  },
  {
    icon: <IconRunner />,
    label: "Coureurs",
    tag: "Performance & Motivation",
    desc: "La compétition est le meilleur carburant. Battez vos records, défiez les autres, analysez chaque foulée.",
    perks: [
      "Suivi GPS en course",
      "Stats personnalisées",
      "Historique complet",
      "Classement en temps réel",
    ],
  },
];

const Profiles = () => (
  <section className={styles.section}>
    <div className={styles.header} data-reveal>
      <span className={styles.tag}>— Profils</span>
      <h2>
        Une app pour <span className={styles.accent}>chaque acteur</span>
      </h2>
    </div>
    <div className={styles.grid}>
      {PROFILES.map((p, i) => (
        <div
          key={i}
          className={styles.card}
          data-reveal
          style={{ transitionDelay: `${i * 0.12}s` }}
        >
          <div className={styles.cardTop}>
            <div className={styles.icon}>{p.icon}</div>
            <span className={styles.cardTag}>{p.tag}</span>
          </div>
          <h3>{p.label}</h3>
          <p>{p.desc}</p>
          <ul className={styles.perks}>
            {p.perks.map((pk, j) => (
              <li key={j}>
                <span className={styles.dot} />
                {pk}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default Profiles;
