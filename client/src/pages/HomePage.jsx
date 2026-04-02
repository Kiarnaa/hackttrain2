import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import LandingHeader from "../components/LandingHeader";

const pal = {
  white:      "#FAFAF8",
  beige:      "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark:  "#D4C8B4",
  maroon:     "#6B1E2A",
  text:       "#1A1410",
  muted:      "#7A6E64",
};

export default function HomePage() {
  const { user } = useAuth();
  const { count: basketCount, setIsOpen: openCart } = useCart();
  const { items: wishlist } = useWishlist();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [user, navigate]);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  const quickLinks = [
    {
      icon: "🛍️", label: "Catalogue", sub: "Explorer la collection",
      action: () => navigate("/catalogue"), color: pal.maroon,
    },
    {
      icon: "👤", label: "Mon Compte", sub: "Vos infos & commandes",
      action: () => navigate("/mon-compte"), color: "#3a5a8a",
    },
    {
      icon: "🛒", label: `Panier (${basketCount})`,
      sub: basketCount ? "Articles en attente" : "Votre panier est vide",
      action: () => openCart(true), color: "#3a7d4c",
    },
    {
      icon: "❤️", label: `Favoris (${wishlist.length})`,
      sub: wishlist.length ? "Vos coups de cœur" : "Aucun favori encore",
      action: () => navigate("/mon-compte"), color: "#8a3a5a",
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: pal.white, color: pal.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <LandingHeader />

      {/* ── WELCOME HERO ── */}
      <section style={{
        minHeight: "50vh",
        display: "flex", alignItems: "center",
        padding: "64px 8%",
        background: `linear-gradient(135deg, ${pal.beigeLight} 0%, ${pal.white} 70%)`,
        position: "relative", overflow: "hidden",
      }}>
        <svg style={{ position: "absolute", right: "-4%", top: "50%", transform: "translateY(-50%)", width: "min(45vw,440px)", opacity: .5, pointerEvents: "none" }}
          viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="320" fill="none" stroke={pal.beigeDark} strokeWidth="1" opacity=".6"/>
          <circle cx="400" cy="400" r="220" fill="none" stroke={pal.beigeDark} strokeWidth="1" opacity=".35"/>
          <circle cx="400" cy="400" r="120" fill="none" stroke={pal.beigeDark} strokeWidth="1" opacity=".2"/>
        </svg>

        <div style={{
          maxWidth: 600, position: "relative", zIndex: 2,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity .8s ease, transform .8s ease",
        }}>
          <p style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: pal.maroon, marginBottom: 16, fontWeight: 500 }}>
            Collection Printemps · 2026
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(38px,5vw,66px)",
            fontWeight: 400, lineHeight: 1.1, marginBottom: 20,
          }}>
            {greeting},{" "}
            <em style={{ fontStyle: "italic", color: pal.maroon }}>{firstName}&nbsp;!</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: pal.muted, maxWidth: 420, marginBottom: 36, fontWeight: 300 }}>
            Bienvenue sur votre espace ETHKL. Que souhaitez-vous explorer aujourd'hui ?
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <Link to="/catalogue" style={{
              background: pal.maroon, color: "#fff", borderRadius: 8,
              padding: "14px 28px", textDecoration: "none",
              fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Explorer le catalogue →
            </Link>
            <button onClick={() => openCart(true)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: pal.maroon, fontSize: 13, fontWeight: 500,
              letterSpacing: ".04em", borderBottom: `1px solid ${pal.maroon}`,
              paddingBottom: 2, fontFamily: "'DM Sans', sans-serif",
            }}>
              {basketCount > 0 ? `Mon panier (${basketCount} article${basketCount > 1 ? "s" : ""})` : "Mon panier"}
            </button>
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS ── */}
      <section style={{ padding: "52px 6%", background: pal.white }}>
        <p style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: pal.muted, marginBottom: 24 }}>
          Accès rapide
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16 }}>
          {quickLinks.map(({ icon, label, sub, action, color }, i) => (
            <div
              key={label}
              onClick={action}
              style={{
                background: pal.white, border: `1px solid ${pal.beige}`,
                borderRadius: 14, padding: "22px 20px",
                cursor: "pointer",
                display: "flex", alignItems: "flex-start", gap: 14,
                animation: `fadeUp .4s ${i * 0.07}s ease both`,
                transition: "box-shadow .2s, transform .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{
                width: 42, height: 42, borderRadius: 10,
                background: color + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>{icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: pal.text, marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 12, color: pal.muted }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATALOGUE BANNER ── */}
      <section style={{ padding: "0 6% 64px" }}>
        <div style={{
          background: `linear-gradient(120deg, ${pal.maroon} 0%, #4a1018 100%)`,
          borderRadius: 20, padding: "48px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 24,
        }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 10 }}>
              Sélection du moment
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(24px,3vw,40px)", color: "#fff",
              fontWeight: 400, lineHeight: 1.2, marginBottom: 8,
            }}>
              Nouvelles pièces <em>pour ce printemps</em>
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", maxWidth: 380, lineHeight: 1.6 }}>
              Lin, mérinos éthique et cuir végétal — des matières qui durent.
            </p>
          </div>
          <Link to="/catalogue" style={{
            background: "rgba(255,255,255,.12)", color: "#fff",
            border: "1px solid rgba(255,255,255,.3)", borderRadius: 8,
            padding: "13px 28px", textDecoration: "none",
            fontSize: 13, fontWeight: 500, letterSpacing: ".06em",
            whiteSpace: "nowrap", backdropFilter: "blur(4px)",
          }}>
            Voir tout le catalogue →
          </Link>
        </div>
      </section>

      {/* ── EDITORIAL ── */}
      <section style={{ background: pal.maroon, padding: "72px 8%", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(20px,3vw,34px)", fontWeight: 400,
            fontStyle: "italic", color: "#fff", lineHeight: 1.5, marginBottom: 20,
          }}>
            "Nous croyons que les objets que vous possédez doivent sembler être des choix — pas des accumulations."
          </p>
          <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>
            — Maharavo, Fondateur
          </span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: pal.text, color: "rgba(255,255,255,.65)", padding: "52px 6% 32px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          flexWrap: "wrap", gap: 32, marginBottom: 44, paddingBottom: 36,
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: ".08em", color: "rgba(255,255,255,.85)" }}>
              ETHKL
            </span>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", marginTop: 8, letterSpacing: ".06em" }}>
              Des objets qui méritent d'être gardés.
            </p>
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {["Boutique", "À Propos", "Durabilité", "Contact", "FAQ"].map(l => (
              <a key={l} href="#" style={{ color: "rgba(255,255,255,.45)", textDecoration: "none", fontSize: 13, letterSpacing: ".04em" }}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 11, color: "rgba(255,255,255,.22)", letterSpacing: ".04em" }}>
          <span>© 2026 ETHKL. Tous droits réservés.</span>
          <span>Fait avec intention.</span>
        </div>
      </footer>
    </div>
  );
}
