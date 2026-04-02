import { useState, useEffect } from "react";
import axios from "../api/axios";

const palette = {
  white: "#FAFAF8",
  beige: "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark: "#D4C8B4",
  maroon: "#6B1E2A",
  maroonLight: "#8B2E3A",
  maroonDark: "#4a1018c3",
  text: "#1a1410c6",
  textMuted: "#7A6E64",
};

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    size: "",
    color: "",
    hover_image: "",
    delivery: "",
    published: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/produits");
      setProducts(response.data.produits);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/produits/${editingProduct.id_products}`, formData);
      } else {
        await axios.post("/produits", formData);
      }
      fetchProducts();
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image_url: product.image_url || "",
      size: product.size || "",
      color: product.color || "",
      hover_image: product.hover_image || "",
      delivery: product.delivery || "",
      published: product.published !== false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await axios.delete(`/produits/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handlePublishToggle = async (product) => {
    try {
      await axios.put(`/produits/${product.id_products}`, {
        ...product,
        published: !product.published,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      size: "",
      color: "",
      hover_image: "",
      delivery: "",
      published: true,
    });
  };

  const openAddModal = () => {
    console.log("Opening add modal");
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div style={styles.root}>
      {/* ── HEADER ── */}
      <header style={styles.header}>
        <a href="#" style={styles.logo}>
          <span style={styles.logoText}>ETHKL Admin</span>
        </a>
        <nav style={styles.nav}>
          <button style={styles.btnPrimary} onClick={openAddModal}>
            Ajouter un Produit
          </button>
        </nav>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={styles.main}>
        <h1 style={styles.title}>Gestion des Produits</h1>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Prix</th>
                <th style={styles.th}>Taille/Pointure</th>
                <th style={styles.th}>Couleur</th>
                <th style={styles.th}>Image Hover</th>
                <th style={styles.th}>Livraison</th>
                <th style={styles.th}>Publié</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id_products} style={styles.tr}>
                  <td style={styles.td}>{product.id_products}</td>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>{product.price} Ar</td>
                  <td style={styles.td}>{product.size}</td>
                  <td style={styles.td}>{product.color}</td>
                  <td style={styles.td}>
                    {product.hover_image && (
                      <img
                        src={product.hover_image}
                        alt="hover"
                        style={styles.thumbnail}
                      />
                    )}
                  </td>
                  <td style={styles.td}>{product.delivery}</td>
                  <td style={styles.td}>
                    <button
                      style={{
                        ...styles.btnSmall,
                        background: product.published ? palette.maroon : palette.textMuted,
                      }}
                      onClick={() => handlePublishToggle(product)}
                    >
                      {product.published ? "Publié" : "Non publié"}
                    </button>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.btnSmall, background: palette.maroonLight }}
                      onClick={() => handleEdit(product)}
                    >
                      Modifier
                    </button>
                    <button
                      style={{ ...styles.btnSmall, background: "#dc3545" }}
                      onClick={() => handleDelete(product.id_products)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── MODAL ── */}
      {showModal && (
        <>
          {console.log("Modal should be visible")}
          <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              style={styles.modalClose}
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 style={styles.modalTitle}>
              {editingProduct ? "Modifier le Produit" : "Ajouter un Produit"}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Prix</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Taille/Pointure</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Couleur</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Image Hover</label>
                <input
                  type="text"
                  value={formData.hover_image}
                  onChange={(e) =>
                    setFormData({ ...formData, hover_image: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Livraison</label>
                <input
                  type="text"
                  value={formData.delivery}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                  />
                  Publié
                </label>
              </div>
              <button type="submit" style={styles.btnPrimary}>
                {editingProduct ? "Modifier" : "Ajouter"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── STYLES ── */
const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: palette.white,
    color: palette.text,
    minHeight: "100vh",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(250,250,248,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${palette.beige}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    height: 64,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    color: palette.text,
  },
  logoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "0.08em",
  },
  nav: {
    display: "flex",
    gap: 20,
  },
  main: {
    padding: "40px 5%",
    maxWidth: 1200,
    margin: "0 auto",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 48,
    fontWeight: 400,
    marginBottom: 40,
    color: palette.text,
  },
  tableContainer: {
    background: palette.white,
    border: `1px solid ${palette.beige}`,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: palette.beige,
    padding: "16px 12px",
    textAlign: "left",
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontWeight: 500,
    color: palette.textMuted,
  },
  tr: {
    borderBottom: `1px solid ${palette.beige}`,
  },
  td: {
    padding: "16px 12px",
    fontSize: 14,
  },
  thumbnail: {
    width: 40,
    height: 40,
    objectFit: "cover",
    borderRadius: 4,
  },
  btnSmall: {
    background: palette.maroon,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 11,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginRight: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: palette.white,
    borderRadius: 20,
    padding: 40,
    maxWidth: 600,
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 24px 64px rgba(107,30,42,0.2)",
  },
  modalClose: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    color: palette.textMuted,
  },
  modalTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 28,
    fontWeight: 600,
    color: palette.maroon,
    marginBottom: 30,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: palette.text,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: palette.text,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  input: {
    border: `1px solid ${palette.beigeDark}`,
    background: palette.white,
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: palette.text,
  },
  textarea: {
    border: `1px solid ${palette.beigeDark}`,
    background: palette.white,
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: palette.text,
    minHeight: 80,
    resize: "vertical",
  },
  btnPrimary: {
    background: palette.maroon,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 28px",
    fontSize: 12,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "background 0.2s ease",
  },
};