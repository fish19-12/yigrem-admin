import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaStar,
  FaTrash,
  FaCloudUploadAlt,
  FaImage,
  FaUser,
  FaCommentDots,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "../styles/reviews.module.css";

const Reviews = () => {
  const API = `${import.meta.env.VITE_API_URL}/api/reviews`;

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    comment: "",
    rating: 5,
    photo: null,
  });

  // =============================
  // GET REVIEWS
  // =============================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      setReviews(res.data);
    } catch (error) {
      console.log(error);

      toast.error("Failed loading reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // =============================
  // INPUT CHANGE
  // =============================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // IMAGE SELECT
  // =============================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,

      photo: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  // =============================
  // STAR SELECT
  // =============================

  const selectRating = (number) => {
    setForm({
      ...form,

      rating: number,
    });
  };

  // =============================
  // ADD REVIEW
  // =============================

  const submitReview = async (e) => {
    e.preventDefault();

    if (!form.name || !form.comment || !form.photo) {
      toast.warning("Please complete all fields");

      return;
    }

    try {
      setUploading(true);

      const data = new FormData();

      data.append("name", form.name);

      data.append("role", form.role);

      data.append("comment", form.comment);

      data.append("rating", form.rating);

      data.append("photo", form.photo);

      const res = await axios.post(API, data);

      setReviews([res.data, ...reviews]);

      setForm({
        name: "",
        role: "",
        comment: "",
        rating: 5,
        photo: null,
      });

      setPreview(null);

      toast.success("Review added successfully");
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // =============================
  // DELETE
  // =============================

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await axios.delete(`${API}/${id}`);

      setReviews(reviews.filter((item) => item._id !== id));

      toast.success("Review deleted");
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" theme="dark" />

      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <h1>Customer Reviews</h1>

          <p>Manage Yigermal design customer feedback</p>
        </div>

        <div className={styles.countCard}>
          <FaCommentDots />
          <span>{reviews.length}</span>
          Reviews
        </div>
      </div>

      {/* FORM */}

      <motion.form
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        onSubmit={submitReview}
        className={styles.form}
      >
        <h2>Add New Review</h2>

        <div className={styles.inputGrid}>
          <div className={styles.inputBox}>
            <FaUser />

            <input
              name="name"
              placeholder="Customer name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputBox}>
            <input
              name="role"
              placeholder="Customer role"
              value={form.role}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* MESSAGE */}

        <div className={styles.inputBoxFull}>
          <FaCommentDots />

          <textarea
            name="comment"
            placeholder="Write customer review..."
            value={form.comment}
            onChange={handleChange}
          />
        </div>

        {/* RATING */}

        <div className={styles.ratingBox}>
          <p>Customer Rating</p>

          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => selectRating(star)}
                className={
                  star <= form.rating ? styles.activeStar : styles.star
                }
              />
            ))}
          </div>
        </div>

        {/* IMAGE UPLOAD */}

        <div className={styles.uploadArea}>
          <label>
            <FaCloudUploadAlt />

            <span>Upload Customer Photo</span>

            <input type="file" accept="image/*" onChange={handleImage} />
          </label>

          {preview && (
            <div className={styles.previewBox}>
              <img src={preview} alt="preview" />

              <button
                type="button"
                onClick={() => {
                  setPreview(null);

                  setForm({
                    ...form,
                    photo: null,
                  });
                }}
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        <button disabled={uploading} className={styles.submitBtn}>
          {uploading ? (
            <>
              <FaSpinner className={styles.spin} />
              Uploading...
            </>
          ) : (
            <>
              <FaImage />
              Publish Review
            </>
          )}
        </button>
      </motion.form>

      {/* REVIEWS LIST */}

      <section className={styles.reviewSection}>
        <h2>All Customer Reviews</h2>

        {loading ? (
          <div className={styles.loading}>
            <FaSpinner className={styles.spin} />
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className={styles.empty}>No reviews found</div>
        ) : (
          <div className={styles.grid}>
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{
                    opacity: 0,

                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,

                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,

                    scale: 0.8,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className={styles.card}
                >
                  {/* IMAGE */}

                  <div className={styles.imageWrapper}>
                    <img
                      src={review.photoUrl || "https://via.placeholder.com/400"}
                      alt={review.name}
                    />

                    <div className={styles.ratingBadge}>
                      <FaStar />

                      {review.rating}
                    </div>
                  </div>

                  {/* INFO */}

                  <div className={styles.info}>
                    <h3>{review.name}</h3>

                    <span>{review.role}</span>

                    <p>"{review.comment}"</p>

                    <div className={styles.cardBottom}>
                      <div className={styles.smallStars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            className={
                              s <= review.rating
                                ? styles.activeStar
                                : styles.star
                            }
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => deleteReview(review._id)}
                        className={styles.deleteBtn}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default Reviews;
