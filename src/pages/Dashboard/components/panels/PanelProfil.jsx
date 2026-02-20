import styles from "./Panels.module.scss";

const PanelProfil = ({ user, initials, roleLabel, roleIcon }) => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.tag}>— Profil</span>
      <h2 className={styles.panelTitle}>
        Mon <span className={styles.accent}>compte</span>
      </h2>
    </div>

    <div className={styles.profilCard}>
      <div className={styles.profilAvatar}>
        {user?.profileImage ? (
          <img src={user.profileImage} alt="Avatar" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className={styles.profilMeta}>
        <div className={styles.roleBadge}>
          {roleIcon} {roleLabel}
        </div>
        <div className={styles.profilName}>
          {user?.firstname ?? "—"} {user?.lastname ?? ""}
        </div>
        <div className={styles.profilEmail}>{user?.email ?? "—"}</div>
      </div>
    </div>

    <div className={styles.profilFields}>
      {[
        { lbl: "Prénom", val: user?.firstname ?? "—" },
        { lbl: "Nom", val: user?.lastname ?? "—" },
        { lbl: "Email", val: user?.email ?? "—" },
        { lbl: "Rôle", val: roleLabel },
      ].map((f) => (
        <div key={f.lbl} className={styles.profilField}>
          <span className={styles.profilFieldLbl}>{f.lbl}</span>
          <span className={styles.profilFieldVal}>{f.val}</span>
        </div>
      ))}
    </div>
  </div>
);

export default PanelProfil;
