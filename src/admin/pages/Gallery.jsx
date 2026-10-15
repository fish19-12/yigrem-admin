import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import imageCompression from "browser-image-compression";

import { FaCloudUploadAlt, FaTrash, FaGem, FaImage } from "react-icons/fa";

import styles from "../styles/adminGallery.module.css";

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

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/gallery`,
      );

      setImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Unable to load gallery images:", error);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (!preview) return undefined;

    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file || !title.trim()) {
      window.alert("Please enter a design name and choose an image.");
      return;
    }

    try {
      setLoading(true);

      let uploadFile = file;

      if (file.size > 2 * 1024 * 1024) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1400,
          useWebWorker: true,
        });

        uploadFile = new File([compressedFile], file.name, {
          type: compressedFile.type,
        });
      }

      const formData = new FormData();
      formData.append("image", uploadFile);
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("price", price.trim());
      formData.append("description", description.trim());

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/gallery`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.gallery) {
        setImages((currentImages) => [response.data.gallery, ...currentImages]);
      } else {
        await fetchImages();
      }

      setTitle("");
      setPrice("");
      setDescription("");
      setFile(null);
      setPreview(null);

      const fileInput = event.currentTarget.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Gallery upload failed:", error);
      window.alert(
        error.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    const confirmed = window.confirm("Delete this Yigermal Design image?");

    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/gallery/${id}`);

      setImages((currentImages) =>
        currentImages.filter((item) => item._id !== id),
      );
    } catch (error) {
      console.error("Gallery image deletion failed:", error);
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
