import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "../styles/layout.module.css";

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const titles = {
    "/admin": "Dashboard",
    "/admin/gallery": "Gallery",
    "/admin/bookings": "Bookings",
    "/admin/reviews": "Reviews",
  };

  const pageTitle = titles[location.pathname] || "Admin Panel";

  return (
    <div className={styles.container}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={styles.main}>
        <Header title={pageTitle} setSidebarOpen={setSidebarOpen} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
