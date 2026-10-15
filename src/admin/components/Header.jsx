import styles from "../styles/header.module.css";
import { FaBars, FaBell } from "react-icons/fa";

const Header = ({
  title,
  setSidebarOpen,
  notificationCount = 0,
  onBellClick,
}) => {
  return (
    <header className={styles.header}>
      {/* Left Section */}
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>

        <h1>{title}</h1>
      </div>

      {/* Right Section */}
      <div className={styles.right}>
        <button
          className={styles.notification}
          onClick={onBellClick}
          aria-label="Notifications"
        >
          <FaBell />

          {notificationCount > 0 && (
            <span className={styles.badge}>
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
