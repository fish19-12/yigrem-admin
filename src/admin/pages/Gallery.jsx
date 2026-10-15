import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import imageCompression from "browser-image-compression";

import {
  FaCloudUploadAlt,
  FaTrash,
  FaGem,
  FaImage,
  FaTags,
  FaMoneyBillWave,
} from "react-icons/fa";

import styles from "../styles/adminGallery.module.css";

const categories = ["Bridal", "Chiffon", "Modern", "Textile", "Traditional"];

const AdminGallery = () => {
  const [images, setImages] = useState([]);

  const [title, setTitle] = useState("");

  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("Bridal");

  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchImages();

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/gallery`,
      );

      setImages(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);

    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !title) {
      alert("Please add title and image");

      return;
    }

    try {
      setLoading(true);

      let uploadFile = file;

      if (file.size > 2 * 1024 * 1024) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,

          maxWidthOrHeight: 1400,

          useWebWorker: true,
        });

        uploadFile = new File([compressed], file.name, {
          type: compressed.type,
        });
      }

      const formData = new FormData();

      formData.append("image", uploadFile);

      formData.append("title", title);

      formData.append("category", category);

      formData.append("price", price);

      formData.append("description", description);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/gallery`,

        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setImages([res.data.gallery, ...images]);

      setTitle("");

      setPrice("");

      setDescription("");

      setFile(null);

      setPreview(null);
    } catch (error) {
      console.log(error);

      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    const confirmDelete = window.confirm("Delete this Fiyorina design?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/gallery/${id}`);

      setImages(images.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={styles.header}
      >
        <div className={styles.logo}>
          <FaGem />
        </div>

        <div>
          <h1>Yigermal design Gallery Studio</h1>

          <p>Manage luxury fashion collections</p>
        </div>
      </motion.div>

      {/* UPLOAD */}

      <motion.form onSubmit={handleUpload} className={styles.uploadCard}>
        <h2>
          <FaCloudUploadAlt />
          Upload New Design
        </h2>

        <div className={styles.formGrid}>
          <input
            className={styles.input}
            placeholder="Dress name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <input
            className={styles.input}
            placeholder="Price e.g 45000 Birr"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Design description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className={styles.uploadBox}>
          <FaImage />

          <span>{file ? file.name : "Choose fashion image"}</span>

          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {preview && (
          <div className={styles.previewBox}>
            <img src={preview} alt="preview" />
          </div>
        )}

        <button disabled={loading} className={styles.uploadButton}>
          {loading ? "Uploading..." : "Publish Design"}
        </button>
      </motion.form>

      {/* GALLERY */}

      <h2 className={styles.sectionTitle}>Collection Designs</h2>

      {fetching ? (
        <p>Loading collections...</p>
      ) : (
        <div className={styles.grid}>
          <AnimatePresence>
            {images.map((item) => (
              <motion.div
                key={item._id}
                className={styles.card}
                whileHover={{
                  y: -8,
                }}
              >
                <img src={item.imageUrl} alt={item.title} />

                <div className={styles.cardInfo}>
                  <h3>{item.title}</h3>

                  <span>{item.category}</span>

                  <p>{item.price}</p>

                  <button onClick={() => deleteImage(item._id)}>
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
