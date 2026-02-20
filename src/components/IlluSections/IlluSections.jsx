import styles from "./IlluSections.module.scss";
import IlluMap from "../shared/IlluMap";
import IlluStats from "../shared/IlluStats";
import IlluRanking from "../shared/IlluRanking";
import IlluSpectator from "../shared/IlluSpectator";

const SECTIONS = [
  {
    tag: "Suivi GPS",
    alt: false,
    title: (
      <>
        Chaque coureur,
        <br />
        <span className={styles.accent}>visible en temps réel</span>
      </>
    ),
    desc: "Suivez la position exacte de chaque participant sur une carte interactive. Les spectateurs, organisateurs et coureurs ont tous une vue live du parcours.",
    perks: [
      "Position actualisée en continu",
      "Précision inférieure à 2 mètres",
      "Visualisation multi-coureurs",
      "Compatible tous terrains",
    ],
    visual: (
      <div className={styles.mapBox}>
        <IlluMap />
      </div>
    ),
  },
  {
    tag: "Statistiques",
    alt: true,
    title: (
      <>
        Analysez,
        <br />
        <span className={styles.accent}>progressez</span>
      </>
    ),
    desc: "Accédez à l'intégralité de votre historique de courses. Allure, fréquence cardiaque, dénivelé — chaque donnée est archivée et analysée.",
    perks: [
      "Historique illimité",
      "Comparaison course par course",
      "Graphiques d'évolution",
      "Export des données",
    ],
    visual: (
      <div className={styles.statsBox}>
        <div className={styles.statsHeader}>
          <span className={styles.statsTitle}>Performance · Semaine</span>
          <span className={styles.statsBadge}>+12% vs semaine passée</span>
        </div>
        <IlluStats />
        <div className={styles.statsKpis}>
          {[
            { val: "68.4 km", lbl: "Volume total" },
            { val: "4'28\"", lbl: "Allure moyenne" },
            { val: "7h 42m", lbl: "Temps en course" },
          ].map((k) => (
            <div key={k.lbl} className={styles.statsKpi}>
              <span className={styles.statsKpiVal}>{k.val}</span>
              <span className={styles.statsKpiLbl}>{k.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: "Classement",
    alt: false,
    title: (
      <>
        La compétition,
        <br />
        <span className={styles.accent}>seconde par seconde</span>
      </>
    ),
    desc: "Le classement se recalcule toutes les 10 secondes. Suivez votre position, voyez vos adversaires se rapprocher ou décrocher.",
    perks: [
      "Actualisation toutes les 10s",
      "Classement général & catégories",
      "Écarts en temps réel",
      "Notifications de dépassement",
    ],
    visual: <IlluRanking />,
  },
  {
    tag: "Spectateurs",
    alt: true,
    title: (
      <>
        Suivre ses proches,
        <br />
        <span className={styles.accent}>comme jamais</span>
      </>
    ),
    desc: "Fini d'attendre sans savoir où en est le coureur. Avec Mova, vous savez exactement où il est, à quelle allure il court, et sa position au classement.",
    perks: [
      "Position GPS en direct",
      "Alertes aux points clés",
      "Envoi d'encouragements",
      "Partage du suivi facilement",
    ],
    visual: <IlluSpectator />,
  },
];

const IlluSections = () => (
  <>
    {SECTIONS.map((s, i) => (
      <section
        key={i}
        className={`${styles.section} ${s.alt ? styles.alt : ""}`}
        data-reveal
      >
        <div className={`${styles.inner} ${s.alt ? styles.innerReverse : ""}`}>
          <div className={styles.text}>
            <span className={styles.tag}>— {s.tag}</span>
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
            <ul className={styles.list}>
              {s.perks.map((p, j) => (
                <li key={j}>
                  <span className={styles.dot} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.visual}>{s.visual}</div>
        </div>
      </section>
    ))}
  </>
);

export default IlluSections;
