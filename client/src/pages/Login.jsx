import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

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
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-white bg-[radial-gradient(circle_at_1px_1px,rgba(139,69,19,0.1)_1px,transparent_0)] bg-[length:20px_20px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-stone-100 shadow-xl rounded-lg p-8 w-full max-w-md min-h-[500px] border border-stone-200 flex flex-col justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          className="text-2xl font-bold text-stone-800 mb-6 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Content de vous revoir
        </motion.h2>
        <div className="w-16 h-1 bg-amber-700 mx-auto mb-6 rounded-full"></div>

        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { x: -20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            <label className="block text-sm font-medium text-stone-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50 text-stone-800 placeholder-stone-400"
              placeholder="vous@exemple.com"
              required
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { x: -20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50 text-stone-800 placeholder-stone-400"
              placeholder="••••••••"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-amber-700 text-white rounded-md font-medium hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </motion.button>
        </motion.form>

        <motion.p
          className="text-center text-sm text-stone-500 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="text-amber-600 font-medium hover:underline">
            S'inscrire
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
