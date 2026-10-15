import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaImages,
  FaCalendarAlt,
  FaStar,
  FaVideo,
  FaGem,
  FaArrowRight,
  FaShoppingBag,
  FaUsers,
} from "react-icons/fa";

import styles from "../styles/dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const menu = [
    {
      title: "Bookings",
      desc: "Manage customer bridal orders and appointments",
      icon: <FaCalendarAlt />,
      path: "/admin/bookings",
      color: "#d81b60",
      count: "Orders",
    },

    {
      title: "Gallery",
      desc: "Upload and manage luxury dress collections",
      icon: <FaImages />,
      path: "/admin/gallery",
      color: "#8b5cf6",
      count: "Photos",
    },

    {
      title: "Reviews",
      desc: "View customer feedback and ratings",
      icon: <FaStar />,
      path: "/admin/reviews",
      color: "#f59e0b",
      count: "Reviews",
    },

    {
      title: "Tutorials",
      desc: "Manage beauty and fashion tutorials",
      icon: <FaVideo />,
      path: "/admin/tutorials",
      color: "#10b981",
      count: "Videos",
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={styles.header}
      >
        <div className={styles.brand}>
          <div className={styles.logo}>
            <FaGem />
          </div>

          <div>
            <h1>Yigermal design</h1>

            <p>Admin Control Center</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <FaShoppingBag />

            <div>
              <span>Orders</span>

              <strong>Manage</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <FaUsers />

            <div>
              <span>Customers</span>

              <strong>Active</strong>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TITLE */}

      <div className={styles.sectionTitle}>
        <h2>Dashboard Menu</h2>

        <p>Manage your complete fashion business from here</p>
      </div>

      {/* CARDS */}

      <div className={styles.grid}>
        {menu.map((item, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.1,
            }}
            className={styles.card}
            onClick={() => navigate(item.path)}
            style={{
              "--accent": item.color,
            }}
          >
            <div className={styles.top}>
              <div className={styles.icon}>{item.icon}</div>

              <span>{item.count}</span>
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>

            <button>
              Open
              <FaArrowRight />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
