import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import styles from "../styles/UnavailableBookings.module.css";

// ✅ IMPORT SHARED TIME PERIODS
import { timePeriods } from "../../utils/timePeriods";

export default function UnavailableBookings() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH SLOTS
  const fetchSlots = async () => {
    try {
      const res = await api.get("/api/unavailable-slots");
      setSlots(res.data);
    } catch {
      toast.error("Failed to load slots");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // BLOCK SLOT
  const blockSlot = async () => {
    if (!date || !time) {
      return toast.error("Select date and time");
    }

    try {
      setLoading(true);

      await api.post("/api/unavailable-slots", {
        date,
        time,
      });

      toast.success("Time blocked");

      setDate("");
      setTime("");
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  // DELETE SLOT
  const deleteSlot = async (id) => {
    if (!window.confirm("Remove blocked slot?")) return;

    try {
      await api.delete(`/api/unavailable-slots/${id}`);
      toast.success("Removed");
      fetchSlots();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Unavailable Booking Times</h1>

      {/* FORM */}
      <div className={styles.card}>
        <div className={styles.grid}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input}
          />

          {/* ✅ GROUPED TIME SELECT */}
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Time</option>

            {timePeriods.map((period) => (
              <optgroup key={period.label} label={period.label}>
                {period.times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <button
          onClick={blockSlot}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Blocking..." : "Block Time Slot"}
        </button>
      </div>

      {/* LIST */}
      <div className={styles.list}>
        {slots.map((slot) => (
          <div key={slot._id} className={styles.slot}>
            <div>
              <p className={styles.date}>
                {new Date(slot.date).toISOString().split("T")[0]}
              </p>
              <p className={styles.time}>{slot.time}</p>
            </div>

            <button
              onClick={() => deleteSlot(slot._id)}
              className={styles.deleteBtn}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
