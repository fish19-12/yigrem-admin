import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { FaCloudUploadAlt, FaTrash, FaGem, FaImage } from "react-icons/fa";

import styles from "../styles/adminGallery.module.css";

// Remove accidental spaces from the .env URL.
const API_URL = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

const categories = ["Women", "Men", "Couples", "Family"];

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Women");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fileInputRef = useRef(null);

  const fetchImages = useCallback(async () => {
    if (!API_URL) {
      console.error("VITE_API_URL is missing.");
      setFetching(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/gallery`);

      setImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "Unable to load gallery images:",
        error.response?.data || error.message,
      );
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Release the old preview URL whenever the selected image changes.
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      window.alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // Release the previous preview before replacing it.
    setPreview((oldPreview) => {
      if (oldPreview) URL.revokeObjectURL(oldPreview);
      return URL.createObjectURL(selectedFile);
    });

    setFile(selectedFile);
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategory("Women");
    setDescription("");
    setFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!API_URL) {
      window.alert(
        "The API URL is missing. Check VITE_API_URL in your frontend environment variables.",
      );
      return;
    }

    if (!file || !title.trim()) {
      window.alert("Please enter a design name and choose an image.");
      return;
    }

    if (!categories.includes(category)) {
      window.alert("Please select a valid gallery category.");
      return;
    }

    try {
      setLoading(true);

      let uploadFile = file;

      // Compress large images before uploading.
      if (file.size > 2 * 1024 * 1024) {
        uploadFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1400,
          useWebWorker: true,
        });

        // Preserve the original filename for multipart upload.
        uploadFile = new File([uploadFile], file.name, {
          type: uploadFile.type,
        });
      }

      const formData = new FormData();

      // These names must match your existing backend.
      formData.append("image", uploadFile);
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("price", price.trim());
      formData.append("description", description.trim());

      // Let Axios/browser set the multipart Content-Type and boundary.
      const response = await axios.post(`${API_URL}/api/gallery`, formData, {
        timeout: 120000,
      });

      if (response.data?.gallery) {
        setImages((currentImages) => [response.data.gallery, ...currentImages]);
      } else {
        await fetchImages();
      }

      resetForm();

      window.alert("Design uploaded successfully!");
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      console.error("Gallery upload failed:", {
        status,
        response: error.response?.data,
        message: error.message,
      });

      if (!error.response) {
        window.alert(
          "Cannot reach the server. Check your internet connection and confirm that your Render backend is running.",
        );
      } else if (status === 413) {
        window.alert(
          "The image is too large for the server. Please select a smaller image.",
        );
      } else if (status === 400) {
        window.alert(
          serverMessage ||
            "Invalid upload. Please check your image and form details.",
        );
      } else if (status === 500) {
        window.alert(
          `The server failed to save the image.${serverMessage ? ` Details: ${serverMessage}` : ""} Check your Render backend logs.`,
        );
      } else {
        window.alert(
          serverMessage ||
            `Upload failed (${status || "unknown error"}). Please try again.`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete this Yigermal Design image?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/gallery/${id}`);

      setImages((currentImages) =>
        currentImages.filter((item) => item._id !== id),
      );

      window.alert("Gallery image deleted successfully.");
    } catch (error) {
      console.error(
        "Gallery image deletion failed:",
        error.response?.data || error.message,
      );

      window.alert(
        error.response?.data?.message || "Delete failed. Please try again.",
      );
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <div className={styles.logo}>
          <FaGem />
        </div>

        <div>
          <h1>Yigermal Design Gallery Studio</h1>
          <p>Manage Women, Men, Couples, and Family collections</p>
        </div>
      </motion.div>

      <motion.form onSubmit={handleUpload} className={styles.uploadCard}>
        <h2>
          <FaCloudUploadAlt />
          Upload New Design
        </h2>

        <div className={styles.formGrid}>
          <input
            className={styles.input}
            placeholder="Design name"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <select
            className={styles.input}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            placeholder="Price, e.g. 45000 Birr"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Design description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label className={styles.uploadBox}>
          <FaImage />
          <span>{file ? file.name : "Choose gallery image"}</span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>

        {preview && (
          <div className={styles.previewBox}>
            <img src={preview} alt="Selected design preview" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={styles.uploadButton}
        >
          {loading ? "Uploading..." : "Publish Design"}
        </button>
      </motion.form>

      <h2 className={styles.sectionTitle}>Gallery Designs</h2>

      {fetching ? (
        <p>Loading gallery...</p>
      ) : images.length === 0 ? (
        <p>No designs have been uploaded yet.</p>
      ) : (
        <div className={styles.grid}>
          <AnimatePresence>
            {images.map((item) => (
              <motion.div
                key={item._id}
                className={styles.card}
                whileHover={{ y: -6 }}
                layout
              >
                <img src={item.imageUrl} alt={item.title} loading="lazy" />

                <div className={styles.cardInfo}>
                  <h3>{item.title}</h3>
                  <span>{item.category}</span>
                  <p>{item.price || "Contact for price"}</p>

                  <button type="button" onClick={() => deleteImage(item._id)}>
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
