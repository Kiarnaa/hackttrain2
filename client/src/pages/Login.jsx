import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import LandingHeader from "../components/LandingHeader";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/AdminPage");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <LandingHeader />
      <motion.div
        style={styles.body}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={styles.card}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <motion.p
            style={styles.eyebrow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Bienvenue
          </motion.p>
          <motion.h2
            style={styles.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Connexion
          </motion.h2>

          {error && (
            <motion.div
              style={styles.errorBox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            style={styles.form}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
            }}
          >
            <motion.div
              style={styles.field}
              variants={{ hidden: { x: -16, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
            >
              <label style={styles.label}>Adresse e-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="vous@exemple.com"
                required
              />
            </motion.div>
            <motion.div
              style={styles.field}
              variants={{ hidden: { x: -16, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
            >
              <label style={styles.label}>Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </motion.button>
          </motion.form>

          <p style={styles.footer}>
            Pas encore de compte ?{" "}
            <Link to="/register" style={styles.link}>S'inscrire</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const palette = {
  white: "#FAFAF8",
  beige: "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark: "#D4C8B4",
  maroon: "#6B1E2A",
  text: "#1A1410",
  textMuted: "#7A6E64",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: palette.white,
    fontFamily: "'DM Sans', sans-serif",
    color: palette.text,
  },
  body: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 16px",
    minHeight: "calc(100vh - 102px)",
  },
  card: {
    background: palette.white,
    border: `1px solid ${palette.beige}`,
    borderRadius: 20,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 24px 64px rgba(107,30,42,0.07)",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: palette.maroon,
    marginBottom: 10,
    fontWeight: 500,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 36,
    fontWeight: 400,
    marginBottom: 32,
    color: palette.text,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: palette.textMuted,
    fontWeight: 500,
  },
  input: {
    border: `1px solid ${palette.beigeDark}`,
    background: palette.beigeLight,
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: palette.text,
    width: "100%",
  },
  btn: {
    background: palette.maroon,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 0",
    fontSize: 12,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    marginTop: 8,
    transition: "background 0.2s ease",
  },
  errorBox: {
    background: "#fdf0f0",
    border: "1px solid #e8c8c8",
    color: "#8b2020",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 13,
    marginBottom: 20,
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: palette.textMuted,
    marginTop: 24,
  },
  link: {
    color: palette.maroon,
    textDecoration: "none",
    fontWeight: 500,
    borderBottom: `1px solid ${palette.maroon}`,
    paddingBottom: 1,
  },
};

export default Login;
