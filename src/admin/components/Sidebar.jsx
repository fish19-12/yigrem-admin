import { useNavigate, NavLink } from "react-router-dom";

import styles from "../styles/sidebar.module.css";
import {
  FaHome,
  FaImage,
  FaStar,
  FaCalendar,
  FaSignOutAlt,
  FaYoutube,
  FaBan,
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  /* =========================
     CLOSE SIDEBAR
  ========================= */

  const closeSidebar = () => setSidebarOpen(false);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    closeSidebar();

    navigate("/login");
  };

  return (
    <>
      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.showOverlay : ""}`}
        onClick={closeSidebar}
      />

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div>
          {/* =========================
              LOGO
          ========================= */}

          <h2 className={styles.logo}>
            yigermal design <span>Admin</span>
          </h2>

          {/* =========================
              NAVIGATION
          ========================= */}

          <nav className={styles.nav}>
            {/* DASHBOARD */}

            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={closeSidebar}
            >
              <FaHome />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={closeSidebar}
            >
              <FaCalendar />
              Orders
            </NavLink>

            {/* GALLERY */}

            <NavLink
              to="/admin/gallery"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={closeSidebar}
            >
              <FaImage />
              Gallery
            </NavLink>

            {/* REVIEWS */}

            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={closeSidebar}
            >
              <FaStar />
              Reviews
            </NavLink>

            {/* BOOKINGS */}

            {/* NHATTY TUTORIALS */}
          </nav>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className={styles.footer}>
          <button className={styles.logout} onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
