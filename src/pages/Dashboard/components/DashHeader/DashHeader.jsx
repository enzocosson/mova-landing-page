import { Link } from "react-router-dom";
import styles from "./DashHeader.module.scss";

const DashHeader = ({ user, initials, roleLabel, roleIcon, onLogout }) => (
  <header className={styles.header}>
    <Link to="/" className={styles.logo}>
      <img src="/full_logo_white.svg" alt="Mova" />
    </Link>

    <div className={styles.user}>
      <div className={styles.avatar}>
        {user?.profileImage ? (
          <img src={user.profileImage} alt="Avatar" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className={styles.userInfo}>
        <span className={styles.userName}>
          {user?.firstname ?? "—"} {user?.lastname ?? ""}
        </span>
        <span className={styles.userRole}>
          {roleIcon} {roleLabel}
        </span>
      </div>
    </div>

    <button className={styles.logoutBtn} onClick={onLogout}>
      Se déconnecter
    </button>
  </header>
);

export default DashHeader;
