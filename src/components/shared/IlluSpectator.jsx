import styles from "../../components/IlluSections/IlluSections.module.scss";

const IlluSpectator = () => (
  <div className={styles.illuSpectator}>
    <div className={styles.illuSpecTop}>
      <div className={styles.illuSpecAvatar}>TM</div>
      <div>
        <div className={styles.illuSpecName}>Thomas M.</div>
        <div className={styles.illuSpecStatus}>
          <span className={styles.illuSpecDot} />
          En course · Km 8.2
        </div>
      </div>
      <div className={styles.illuSpecRank}>#1</div>
    </div>
    <div className={styles.illuSpecPhoto}>
      <img src="/assets/images/spectator-photo.png" alt="Course en direct" className={styles.illuSpecImg} />
      <span className={styles.illuSpecLiveBadge}>● LIVE</span>
    </div>
    <div className={styles.illuSpecStats}>
      {[
        { val: "4'13\"", lbl: "Allure" },
        { val: "168", lbl: "BPM" },
        { val: "42:18", lbl: "Temps" },
      ].map((s) => (
        <div key={s.lbl} className={styles.illuSpecStat}>
          <span className={styles.illuSpecVal}>{s.val}</span>
          <span className={styles.illuSpecLbl}>{s.lbl}</span>
        </div>
      ))}
    </div>
    <div className={styles.illuSpecBar}>
      <div className={styles.illuSpecBarFill} style={{ width: "82%" }} />
    </div>
    <div className={styles.illuSpecBarLabels}>
      <span>0 km</span>
      <span>8.2 / 10 km</span>
    </div>
    <button className={styles.illuSpecBtn}>📣 Envoyer un encouragement</button>
  </div>
);

export default IlluSpectator;
