// admin/pages/Tutorials.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import api from "../../services/api";

import styles from "../styles/tutorials.module.css";

const Tutorials = () => {
  /* =========================
     FORM STATES
  ========================= */

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  // UPDATED DEFAULT CATEGORY
  const [category, setCategory] = useState("Nhatty Reborn Cut");

  const [level, setLevel] = useState("Beginner");

  const [duration, setDuration] = useState("");

  const [thumbnail, setThumbnail] = useState(null);

  const [video, setVideo] = useState(null);

  /* =========================
     PREVIEW STATES
  ========================= */

  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [videoPreview, setVideoPreview] = useState("");

  /* =========================
     DATA STATES
  ========================= */

  const [tutorials, setTutorials] = useState([]);

  const [loading, setLoading] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(true);

  const [progress, setProgress] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  /* =========================
     GET TUTORIALS
  ========================= */

  const fetchTutorials = async () => {
    try {
      setFetchLoading(true);

      const res = await api.get("/api/tutorials");

      setTutorials(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  /* =========================
     FILE CHANGE
  ========================= */

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    setThumbnail(file);

    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const sizeGB = file.size / 1024 / 1024 / 1024;

    if (sizeGB > 5) {
      setErrorMessage("Maximum video size is 5GB");

      return;
    }

    setVideo(file);

    setVideoPreview(URL.createObjectURL(file));

    setErrorMessage("");
  };

  /* =========================
     VIDEO UPLOAD
  ========================= */

  const uploadVideoToCloudinary = async () => {
    const cloudinaryFormData = new FormData();

    cloudinaryFormData.append("file", video);

    cloudinaryFormData.append("upload_preset", "nhatty_tutorials");

    cloudinaryFormData.append("resource_type", "video");
    cloudinaryFormData.append("eager", "q_auto,f_auto");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dpl0ydurz/video/upload",
      cloudinaryFormData,
      {
        timeout: 0,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,

        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);

          setProgress(percent);
        },
      },
    );

    return response.data;
  };

  /* =========================
     CREATE TUTORIAL
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    setErrorMessage("");

    if (!thumbnail || !video) {
      setErrorMessage("Thumbnail and video are required");

      return;
    }

    try {
      setLoading(true);

      setProgress(0);

      /* =========================
         STEP 1: VIDEO TO CLOUDINARY
      ========================= */

      const uploadedVideo = await uploadVideoToCloudinary();

      /* =========================
         STEP 2: SEND TO BACKEND
      ========================= */

      const formData = new FormData();

      formData.append("title", title);

      formData.append("description", description);

      formData.append("category", category);

      formData.append("level", level);

      formData.append("duration", duration);

      formData.append("thumbnail", thumbnail);

      formData.append("videoUrl", uploadedVideo.secure_url);

      formData.append("videoPublicId", uploadedVideo.public_id);

      await api.post("/api/tutorials", formData);

      /* SUCCESS */

      setSuccessMessage(
        "🎉 Tutorial uploaded successfully! Your barber tutorial is now live.",
      );

      /* RESET */

      setTitle("");

      setDescription("");

      // UPDATED RESET CATEGORY
      setCategory("Nhatty Reborn Cut");

      setLevel("Beginner");

      setDuration("");

      setThumbnail(null);

      setVideo(null);

      setThumbnailPreview("");

      setVideoPreview("");

      setProgress(0);

      /* REFRESH */

      fetchTutorials();

      /* AUTO REMOVE MESSAGE */

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error(error);

      setErrorMessage(error?.response?.data?.message || "Upload failed");

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this tutorial?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/tutorials/${id}`);

      setTutorials((prev) => prev.filter((tutorial) => tutorial._id !== id));

      setSuccessMessage("🗑️ Tutorial deleted successfully");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setErrorMessage("Delete failed");
    }
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}

      <div className={styles.header}>
        <h1>Nhatty Tutorials</h1>

        <p>Upload professional barber tutorials for students and barbers.</p>
      </div>

      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div
          style={{
            background: "linear-gradient(135deg, #00c853, #00e676)",
            color: "#fff",
            padding: "16px 20px",
            borderRadius: "14px",
            marginBottom: "20px",
            fontWeight: "600",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.4s ease",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {errorMessage && (
        <div
          style={{
            background: "linear-gradient(135deg, #ff1744, #ff5252)",
            color: "#fff",
            padding: "16px 20px",
            borderRadius: "14px",
            marginBottom: "20px",
            fontWeight: "600",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* FORM */}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* TITLE */}

        <div className={styles.group}>
          <label>Title</label>

          <input
            type="text"
            placeholder="Perfect Skin Fade"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}

        <div className={styles.group}>
          <label>Description</label>

          <textarea
            rows="5"
            placeholder="Tutorial description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* CATEGORY + LEVEL */}

        <div className={styles.grid}>
          {/* CATEGORY */}

          <div className={styles.group}>
            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                background: "#111",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "14px",
                borderRadius: "14px",
                fontWeight: "600",
                fontSize: "15px",
                outline: "none",
              }}
            >
              {/* NEW FIRST CATEGORY */}

              <option value="Nhatty Reborn Cut">✨ Nhatty Reborn Cut</option>

              <option value="Fade">Fade</option>

              <option value="Beard">Beard</option>

              <option value="Dreadlocks">Dreadlocks</option>

              <option value="Line Up">Line Up</option>

              <option value="Hair Coloring">Hair Coloring</option>
            </select>
          </div>

          {/* LEVEL */}

          <div className={styles.group}>
            <label>Level</label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{
                background: "#111",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "14px",
                borderRadius: "14px",
                fontWeight: "600",
                fontSize: "15px",
                outline: "none",
              }}
            >
              <option>Beginner</option>

              <option>Intermediate</option>

              <option>Advanced</option>
            </select>
          </div>
        </div>

        {/* DURATION */}

        <div className={styles.group}>
          <label>Duration</label>

          <input
            type="text"
            placeholder="15 Min"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {/* FILES */}

        <div className={styles.grid}>
          {/* THUMBNAIL */}

          <div className={styles.uploadBox}>
            <label>Thumbnail</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              required
            />

            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Preview"
                className={styles.previewImage}
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  objectFit: "cover",
                  borderRadius: "14px",
                  marginTop: "15px",
                }}
              />
            )}
          </div>

          {/* VIDEO */}

          <div className={styles.uploadBox}>
            <label>Video</label>

            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              required
            />

            {videoPreview && (
              <video
                src={videoPreview}
                controls
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  objectFit: "cover",
                  borderRadius: "14px",
                  marginTop: "15px",
                  background: "#000",
                }}
              />
            )}
          </div>
        </div>

        {/* PROGRESS */}

        {loading && (
          <div
            style={{
              width: "100%",
              background: "#222",
              borderRadius: "30px",
              overflow: "hidden",
              marginTop: "20px",
              height: "24px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ffcc70, #ff8c42)",
                transition: "0.3s ease",
              }}
            />

            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              Uploading {progress}%
            </span>
          </div>
        )}

        {/* BUTTON */}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? `Uploading ${progress}%` : "Upload Tutorial"}
        </button>
      </form>

      {/* TUTORIALS */}

      <div className={styles.tutorialSection}>
        <h2>Uploaded Tutorials</h2>

        {fetchLoading ? (
          <p className={styles.loading}>Loading tutorials...</p>
        ) : tutorials.length === 0 ? (
          <p className={styles.empty}>No tutorials uploaded yet.</p>
        ) : (
          <div className={styles.cards}>
            {tutorials.map((tutorial) => (
              <div
                key={tutorial._id}
                className={styles.card}
                style={{
                  overflow: "hidden",
                  borderRadius: "20px",
                }}
              >
                {/* THUMBNAIL */}

                <img
                  src={tutorial.thumbnailUrl}
                  alt={tutorial.title}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                {/* CONTENT */}

                <div className={styles.cardContent}>
                  <h3>{tutorial.title}</h3>

                  <p>{tutorial.description}</p>

                  {/* META */}

                  <div className={styles.meta}>
                    <span>{tutorial.category}</span>

                    <span>{tutorial.level}</span>

                    <span>{tutorial.duration}</span>
                  </div>

                  {/* VIDEO */}

                  <video
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      maxHeight: "250px",
                      objectFit: "cover",
                      borderRadius: "14px",
                      marginTop: "15px",
                      background: "#000",
                    }}
                  >
                    <source
                      src={tutorial.videoUrl.replace(
                        "/upload/",
                        "/upload/q_auto,f_auto,vc_auto/",
                      )}
                      type="video/mp4"
                    />
                  </video>

                  {/* DELETE */}

                  <button
                    onClick={() => handleDelete(tutorial._id)}
                    className={styles.deleteBtn}
                  >
                    Delete Tutorial
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
