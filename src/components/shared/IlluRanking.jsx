import styles from "../../components/IlluSections/IlluSections.module.scss";

const runners = [
  {
    rank: 1,
    name: "Thomas M.",
    time: "42:18",
    pace: "4'13\"/km",
    dist: "10.0 km",
    delta: null,
  },
  {
    rank: 2,
    name: "Lucas D.",
    time: "42:55",
    pace: "4'17\"/km",
    dist: "9.9 km",
    delta: "+0:37",
  },
  {
    rank: 3,
    name: "Sara K.",
    time: "43:10",
    pace: "4'19\"/km",
    dist: "9.8 km",
    delta: "+0:52",
  },
  {
    rank: 4,
    name: "Marc B.",
    time: "44:02",
    pace: "4'24\"/km",
    dist: "9.6 km",
    delta: "+1:44",
  },
];

const IlluRanking = () => (
  <div className={styles.illuRanking}>
    <div className={styles.illuRankHeader}>
      <span>Classement</span>
      <span className={styles.illuRankLive}>
        <span className={styles.illuRankDot} />
        Live · 8.2 km
      </span>
    </div>
    {runners.map((r) => (
      <div
        key={r.rank}
        className={`${styles.illuRankRow} ${r.rank === 1 ? styles.illuRankFirst : ""}`}
      >
        <span className={styles.illuRankNum}>{r.rank}</span>
        <div className={styles.illuRankInfo}>
          <span className={styles.illuRankName}>{r.name}</span>
          <span className={styles.illuRankPace}>
            {r.pace} · {r.dist}
          </span>
        </div>
        <div className={styles.illuRankRight}>
          <span className={styles.illuRankTime}>{r.time}</span>
          {r.delta && <span className={styles.illuRankDelta}>{r.delta}</span>}
        </div>
      </div>
    ))}
    <div className={styles.illuRankFooter}>
      <span className={styles.illuRankRefresh}>↻ Actualisation dans 7s</span>
    </div>
  </div>
);

export default IlluRanking;
