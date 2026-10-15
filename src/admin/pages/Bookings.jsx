import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import styles from "../styles/bookings.module.css";

import {
  FaCheckCircle,
  FaClock,
  FaTrashAlt,
  FaDownload,
  FaCopy,
  FaCheck,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaImage,
  FaGem,
  FaRulerCombined,
  FaSyncAlt,
  FaTimes,
  FaWifi,
  FaDatabase,
  FaBell,
  FaCreditCard,
  FaShoppingBag,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STORAGE_KEY = "fiyorina_orders_cache";
const SEEN_KEY = "fiyorina_seen_orders";

const Bookings = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [copiedNumber, setCopiedNumber] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  const [isOffline, setIsOffline] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const firstLoadRef = useRef(true);

  // =========================
  // SOUND
  // =========================

  const playSound = () => {
    try {
      const audio = new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
      );

      audio.volume = 0.7;

      audio.play();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // PUSH NOTIFICATION
  // =========================

  const showPushNotification = async (order) => {
    try {
      if (!("Notification" in window)) return;

      if (Notification.permission !== "granted") return;

      const registration = await navigator.serviceWorker.getRegistration();

      if (!registration) return;

      await registration.showNotification("💎 New Fiyorina Order", {
        body: `${order.customer?.name || "Customer"} placed a new bridal order`,

        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",

        badge: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",

        vibrate: [300, 100, 300],

        tag: order._id,

        requireInteraction: true,

        data: {
          url: "/admin/orders",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // SEEN ORDERS
  // =========================

  const getSeen = () => {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  };

  const setSeen = (ids) => {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  };

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get("/api/orders");

      const fetchedOrders = res.data || [];

      setOrders(fetchedOrders);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedOrders));

      setIsOffline(false);

      const seen = getSeen();

      const newOrders = fetchedOrders.filter(
        (order) => !seen.includes(order._id),
      );

      if (firstLoadRef.current) {
        setSeen(fetchedOrders.map((order) => order._id));

        firstLoadRef.current = false;

        return;
      }

      if (newOrders.length > 0) {
        setNotificationCount((prev) => prev + newOrders.length);

        toast.success(`💎 ${newOrders.length} new order received`);

        playSound();

        for (const order of newOrders) {
          await showPushNotification(order);
        }

        setSeen(fetchedOrders.map((order) => order._id));
      }
    } catch (error) {
      console.log(error);

      const cache = localStorage.getItem(STORAGE_KEY);

      if (cache) {
        setOrders(JSON.parse(cache));

        setIsOffline(true);

        toast.info("Offline mode • Showing saved orders");
      } else {
        toast.error("Failed loading orders");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COPY PHONE
  // =========================

  const copyPhone = (phone) => {
    navigator.clipboard.writeText(phone);

    setCopiedNumber(phone);

    toast.success("Phone copied");

    setTimeout(() => {
      setCopiedNumber("");
    }, 2000);
  };

  // =========================
  // DELETE ORDER
  // =========================

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm("Delete this order permanently?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/orders/${id}`);

      const updated = orders.filter((order) => order._id !== id);

      setOrders(updated);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      toast.success("Order deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // =========================
  // SERVICE WORKER
  // =========================

  const registerServiceWorker = async () => {
    try {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/sw.js");

        await navigator.serviceWorker.ready;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // ENABLE NOTIFICATION
  // =========================

  const enableNotifications = async () => {
    try {
      if (!("Notification" in window)) return;

      await Notification.requestPermission();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    registerServiceWorker();

    enableNotifications();

    const cache = localStorage.getItem(STORAGE_KEY);

    if (cache) {
      setOrders(JSON.parse(cache));

      setLoading(false);
    }

    fetchOrders(false);

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* IMAGE PREVIEW */}

      {previewImage && (
        <div
          className={styles.previewModal}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className={styles.previewContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closePreview}
              onClick={() => setPreviewImage(null)}
            >
              <FaTimes />
            </button>

            <img
              src={previewImage}
              className={styles.previewImage}
              alt="payment"
            />
          </div>
        </div>
      )}

      {/* HEADER */}

      <div className={styles.topHeader}>
        <div>
          <h1 className={styles.title}>💎 Yigermal design Orders</h1>

          <p className={styles.subtitle}>
            Manage habesha clothes orders professionally
          </p>
        </div>

        <div className={styles.headerActions}>
          <div
            className={styles.onlineBadge}
            onClick={() => setNotificationCount(0)}
          >
            <FaBell />

            {notificationCount > 0 && (
              <span className={styles.notificationCount}>
                {notificationCount}
              </span>
            )}
          </div>

          {isOffline ? (
            <div className={styles.offlineBadge}>
              <FaDatabase />
              Offline
            </div>
          ) : (
            <div className={styles.onlineBadge}>
              <FaWifi />
              Live
            </div>
          )}

          <button className={styles.refreshBtn} onClick={() => fetchOrders()}>
            <FaSyncAlt />
          </button>

          <div className={styles.totalCard}>
            <span>Total Orders</span>

            <h2>{orders.length}</h2>
          </div>
        </div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className={styles.loadingBox}>
          <div className={styles.loader} />

          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <h3>No orders yet</h3>

          <p>Customer orders will appear here</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {orders.map((order) => (
            <div className={styles.card} key={order._id}>
              <div className={styles.cardTop}>
                <div>
                  <h2 className={styles.customerName}>
                    <FaUser />

                    {order.customer?.name || "Customer"}
                  </h2>

                  <span className={styles.bookingDate}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <span className={styles.pending}>Pending</span>
              </div>

              <div className={styles.quickInfo}>
                <div className={styles.quickCard}>
                  <div className={styles.quickLabel}>
                    <FaPhone />
                    Phone
                  </div>

                  <div className={styles.phoneRow}>
                    <span>{order.customer?.phone}</span>

                    <button
                      className={styles.copyBtn}
                      onClick={() => copyPhone(order.customer?.phone)}
                    >
                      {copiedNumber === order.customer?.phone ? (
                        <FaCheck />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <div className={styles.quickLabel}>
                    <FaShoppingBag />
                    Items
                  </div>

                  <span>{order.items?.length || 0}</span>
                </div>

                <div className={styles.quickCard}>
                  <div className={styles.quickLabel}>
                    <FaMoneyBillWave />
                    Total
                  </div>
                  <div className={styles.addressBox}>
                    <FaMapMarkerAlt />

                    <span>{order.customer?.address}</span>
                  </div>

                  <span className={styles.price}>
                    {Number(order.total).toLocaleString()} ETB
                  </span>
                </div>

                <div className={styles.quickCard}>
                  <div className={styles.quickLabel}>
                    <FaCreditCard />
                    Payment
                  </div>

                  <span>{order.payment?.method || "Telebirr"}</span>
                </div>
              </div>
              <div className={styles.productsSection}>
                <h3 className={styles.sectionTitle}>
                  <FaShoppingBag />
                  Ordered Products
                </h3>

                <div className={styles.productsGrid}>
                  {order.items?.map((item, index) => (
                    <div key={index} className={styles.productCard}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={styles.productImage}
                      />

                      <div>
                        <h4>{item.title}</h4>

                        <p>Qty: {item.quantity}</p>

                        <p>{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.measurementSection}>
                <div className={styles.sectionTitle}>
                  <FaRulerCombined />

                  <h3>Customer Measurements</h3>
                </div>

                <div className={styles.measurementGrid}>
                  <div className={styles.measureCard}>
                    <span>Shoulder</span>
                    <strong>{order.measurements?.shoulder || "-"} cm</strong>
                  </div>

                  <div className={styles.measureCard}>
                    <span>Sleeve</span>
                    <strong>{order.measurements?.sleeve || "-"} cm</strong>
                  </div>

                  <div className={styles.measureCard}>
                    <span>Bust</span>
                    <strong>{order.measurements?.bust || "-"} cm</strong>
                  </div>

                  <div className={styles.measureCard}>
                    <span>Waist</span>
                    <strong>{order.measurements?.waist || "-"} cm</strong>
                  </div>

                  <div className={styles.measureCard}>
                    <span>Hips</span>
                    <strong>{order.measurements?.hips || "-"} cm</strong>
                  </div>

                  <div className={styles.measureCard}>
                    <span>Gown Length</span>
                    <strong>{order.measurements?.gownLength || "-"} cm</strong>
                  </div>

                  <div className={styles.measureCard}>
                    <span>Waist Hem</span>
                    <strong>{order.measurements?.waistHem || "-"} cm</strong>
                  </div>
                </div>
              </div>
              {order.payment?.screenshot && (
                <div className={styles.paymentSection}>
                  <div className={styles.paymentHeader}>
                    <h3>
                      <FaImage />
                      Payment Proof
                    </h3>

                    <a
                      href={order.payment.screenshot}
                      download
                      className={styles.download}
                    >
                      <FaDownload />
                    </a>
                  </div>

                  <div
                    className={styles.imageWrapper}
                    onClick={() => setPreviewImage(order.payment.screenshot)}
                  >
                    <img
                      src={order.payment.screenshot}
                      className={styles.paymentImage}
                      alt="payment"
                    />

                    <div className={styles.imageOverlay}>Preview</div>
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <button className={styles.confirmBtn}>
                  <FaCheckCircle />
                  Confirm
                </button>

                <button className={styles.pendingBtn}>
                  <FaClock />
                  Pending
                </button>

                <button
                  className={styles.delete}
                  onClick={() => deleteOrder(order._id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
