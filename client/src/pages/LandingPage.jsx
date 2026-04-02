import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


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


function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function LandingPage() {
  const { user } = useAuth();
  const { count: basketCount, setIsOpen: openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.root}>
      {/* ── TOP BANNER ── */}
      <div style={styles.banner}>
        <span style={styles.bannerDot} />
        <span style={styles.bannerText}>
          Livraison gratuite pour les commandes supérieures à{" "}
          <strong style={{ fontWeight: 700 }}>50.000 MGA</strong> — sans code promo
        </span>
        <span style={styles.bannerDot} />
      </div>

      {/* ── HEADER ── */}
      <header style={styles.header}>
        <a href="#" style={styles.logo}>
          <span style={styles.logoText}>ETHKL</span>
        </a>

        <nav style={styles.nav}>
          {[
            { label: "Catalogue", to: "/catalogue" },
            { label: "À Propos", to: "/about" },
            ...(!user ? [{ label: "Connexion", to: "/login" }] : []),
          ].map(({ label, to }) => (
            <Link key={label} to={to} style={styles.navLink}>
              {label}
            </Link>
          ))}
          {user && (
            <Link to="/mon-compte" style={{
              ...styles.navLink,
              display: "flex", alignItems: "center", gap: 6,
              textDecoration: "none",
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                background: palette.maroon, color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
              }}>{initials(user.name)}</span>
              {user.name.split(" ")[0]}
            </Link>
          )}
        </nav>

        <button style={styles.basketBtn} onClick={() => openCart(true)}>
          <BasketIcon />
          {basketCount > 0 && (
            <span style={styles.basketBadge}>{basketCount}</span>
          )}
        </button>

        {/* Mobile hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen((o) => !o)}>
          <span style={{ ...styles.bar, transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
          <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...styles.bar, transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {[
            { label: "Catalogue", to: "/catalogue" },
            { label: "À Propos", to: "/about" },
            ...(!user ? [{ label: "Connexion", to: "/login" }] : [{ label: "Mon Compte", to: "/mon-compte" }]),
          ].map(({ label, to }) => (
            <Link key={label} to={to} style={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section style={styles.hero} ref={heroRef}>
        {/* Decorative arcs */}
        <svg style={styles.heroArc} viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="320" fill="none" stroke={palette.beigeDark} strokeWidth="1" opacity="0.5" />
          <circle cx="400" cy="400" r="260" fill="none" stroke={palette.beigeDark} strokeWidth="1" opacity="0.35" />
          <circle cx="400" cy="400" r="200" fill="none" stroke={palette.beigeDark} strokeWidth="1" opacity="0.2" />
        </svg>

        <div
          style={{
            ...styles.heroContent,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <p style={styles.heroEyebrow}>Collection Printemps · 2026</p>
          <h1 style={styles.heroHeadline}>
            Moins d'encombrement,<br />
            <em style={styles.heroItalic}>plus de sens.</em>
          </h1>
          <p style={styles.heroSub}>
            Des objets fabriqués lentement, à la main, conçus pour durer des décennies — pas des saisons.
          </p>
          <div style={styles.heroCta}>
            <button style={styles.btnPrimary}>
              Découvrir la Collection
            </button>
            <a href="/about" style={styles.btnGhost}>
              Notre Histoire →
            </a>
          </div>
        </div>

        {/* Hero visual */}
        <div
          style={{
            ...styles.heroVisual,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateX(0) scale(1)" : "translateX(40px) scale(0.96)",
            transition: "opacity 1.1s 0.2s cubic-bezier(.22,1,.36,1), transform 1.1s 0.2s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div style={styles.heroCard}>
            <div style={styles.heroCardInner}>
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80"
                alt="Veste en Laine"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ ...styles.heroCardTag, position: "absolute", top: 10, left: 10 }}>Fait Main</div>
            </div>
            <div style={styles.heroCardCaption}>
              <span style={styles.heroCardName}>Veste en Laine</span>
              <span style={styles.heroCardPrice}>185.000 Ar</span>
            </div>
          </div>
          {/* Floating accent cards */}
          <div style={styles.floatCard1}>
            <span style={{ fontSize: 11, color: palette.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Naturel</span>
          </div>
          <div style={styles.floatCard2}>
            <span style={{ fontSize: 11, fontWeight: 600, color: palette.maroon }}>★ 4.9</span>
            <span style={{ fontSize: 10, color: palette.textMuted }}>412 avis</span>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div style={styles.trustStrip}>
        {[
          { label: "Approvisionnement durable" },
          { label: "Produits artisanaux" },
          { label: "Emballage sans plastique" },
          { label: "Retours sous 30 jours" },
        ].map(({ label }) => (
          <div key={label} style={styles.trustItem}>
            <span style={styles.trustLabel}>{label}</span>
          </div>
        ))}
      </div>


      {/* ── EDITORIAL STRIP ── */}
      <section style={styles.editorial}>
        <div style={styles.editorialInner}>
          <p style={styles.editorialQuote}>
            "Nous croyons que les objets que vous possédez doivent sembler être des choix — pas des accumulations."
          </p>
          <span style={styles.editorialAuthor}>— Maharavo, Fondateur</span>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={styles.newsletter}>
        <h3 style={styles.newsletterTitle}>Restez informé</h3>
        <p style={styles.newsletterSub}>
          Nouvelles arrivées, histoires des artisans et réductions occasionnelles.
        </p>
        <div style={styles.newsletterForm}>
          <input
            type="email"
            placeholder="votre@email.com"
            style={styles.input}
          />
          <button style={styles.btnPrimary}>S'abonner</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div>
            <span style={styles.logo}>
              <span style={styles.logoText}>ETHKL</span>
            </span>
            <p style={styles.footerTagline}>Des objets qui méritent d'être gardés.</p>
          </div>
          <div style={styles.footerLinks}>
            {["Boutique", "À Propos", "Durabilité", "Contact", "FAQ"].map((l) => (
              <a key={l} href="#" style={styles.footerLink}>{l}</a>
            ))}
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span>© 2026 ETHKL. Tous droits réservés.</span>
          <span>Fait avec intention.</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${palette.white}; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(107,30,42,0.1);
        }
      `}</style>
    </div>
  );
}

/* ── SVG Basket Icon ── */
function BasketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

/* ── STYLES ── */
const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: palette.white,
    color: palette.text,
    overflowX: "hidden",
  },

  // Banner
  banner: {
    background: palette.maroon,
    color: "#fff",
    textAlign: "center",
    padding: "10px 16px",
    fontSize: 13,
    letterSpacing: "0.04em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  bannerDot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.5)",
    display: "inline-block",
  },
  bannerText: {
    fontWeight: 300,
  },

  // Header
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
  logoMark: {
    color: palette.maroon,
    fontSize: 14,
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "0.08em",
  },
  nav: {
    display: "flex",
    gap: 36,
  },
  navLink: {
    textDecoration: "none",
    color: palette.textMuted,
    fontSize: 13,
    letterSpacing: "0.06em",
    fontWeight: 400,
    transition: "color 0.2s",
    textTransform: "uppercase",
  },
  basketBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    color: palette.text,
    padding: 4,
    display: "flex",
    alignItems: "center",
  },
  basketBadge: {
    position: "absolute",
    top: -2,
    right: -6,
    background: palette.maroon,
    color: "#fff",
    borderRadius: "50%",
    width: 16,
    height: 16,
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: 5,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
  bar: {
    width: 22,
    height: 1.5,
    background: palette.text,
    display: "block",
    transition: "all 0.25s ease",
  },
  mobileMenu: {
    background: palette.white,
    borderBottom: `1px solid ${palette.beige}`,
    display: "flex",
    flexDirection: "column",
    padding: "16px 5%",
    gap: 16,
  },
  mobileNavLink: {
    textDecoration: "none",
    color: palette.text,
    fontSize: 15,
    letterSpacing: "0.04em",
  },

  // Hero
  hero: {
    minHeight: "88vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 64,
    padding: "80px 8%",
    background: `linear-gradient(135deg, ${palette.white} 60%, ${palette.beigeLight} 100%)`,
    position: "relative",
    overflow: "hidden",
    flexWrap: "wrap",
  },
  heroArc: {
    position: "absolute",
    right: "-5%",
    top: "50%",
    transform: "translateY(-50%)",
    width: "55vw",
    maxWidth: 640,
    opacity: 0.6,
    pointerEvents: "none",
  },
  heroContent: {
    flex: "1 1 380px",
    maxWidth: 520,
    position: "relative",
    zIndex: 2,
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: palette.maroon,
    marginBottom: 20,
    fontWeight: 500,
  },
  heroHeadline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(44px, 6vw, 76px)",
    lineHeight: 1.08,
    fontWeight: 400,
    marginBottom: 24,
    color: palette.text,
  },
  heroItalic: {
    fontStyle: "italic",
    color: palette.maroon,
  },
  heroSub: {
    fontSize: 15,
    lineHeight: 1.7,
    color: palette.textMuted,
    maxWidth: 380,
    marginBottom: 40,
    fontWeight: 300,
  },
  heroCta: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
  },
  heroVisual: {
    flex: "1 1 300px",
    maxWidth: 360,
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
  },
  heroCard: {
    background: palette.white,
    border: `1px solid ${palette.beige}`,
    borderRadius: 20,
    padding: "32px 28px 20px",
    boxShadow: "0 24px 64px rgba(107,30,42,0.08)",
    width: 240,
  },
  heroCardInner: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    height: 200,
  },
  heroCardTag: {
    background: palette.maroon,
    color: "#fff",
    fontSize: 10,
    letterSpacing: "0.1em",
    padding: "3px 10px",
    borderRadius: 20,
    textTransform: "uppercase",
    fontWeight: 500,
  },
  heroCardCaption: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroCardName: {
    fontSize: 13,
    fontWeight: 500,
  },
  heroCardPrice: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18,
    fontWeight: 600,
    color: palette.maroon,
  },
  floatCard1: {
    position: "absolute",
    top: -16,
    left: -20,
    background: palette.white,
    border: `1px solid ${palette.beige}`,
    borderRadius: 12,
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    fontSize: 20,
  },
  floatCard2: {
    position: "absolute",
    bottom: 12,
    right: -24,
    background: palette.white,
    border: `1px solid ${palette.beige}`,
    borderRadius: 12,
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  // Trust strip
  trustStrip: {
    background: palette.beige,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 0,
    borderTop: `1px solid ${palette.beigeDark}`,
    borderBottom: `1px solid ${palette.beigeDark}`,
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 32px",
    borderRight: `1px solid ${palette.beigeDark}`,
  },
  trustIcon: {
    fontSize: 18,
  },
  trustLabel: {
    fontSize: 12,
    letterSpacing: "0.06em",
    color: palette.textMuted,
    textTransform: "uppercase",
    fontWeight: 500,
  },

  // Catalogue
  catalogue: {
    padding: "80px 6%",
    maxWidth: 1200,
    margin: "0 auto",
  },
  sectionHeader: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: 400,
    marginBottom: 8,
  },
  sectionSub: {
    color: palette.textMuted,
    fontSize: 14,
    letterSpacing: "0.04em",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 40,
    flexWrap: "wrap",
  },
  filterBtn: {
    background: "none",
    border: `1px solid ${palette.beigeDark}`,
    borderRadius: 30,
    padding: "7px 20px",
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    color: palette.textMuted,
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  filterBtnActive: {
    background: palette.maroon,
    border: `1px solid ${palette.maroon}`,
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 28,
  },
  card: {
    background: palette.white,
    border: `1px solid ${palette.beige}`,
    borderRadius: 16,
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    animation: "fadeUp 0.6s ease both",
    cursor: "pointer",
  },
  cardImg: {
    background: palette.beigeLight,
    height: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardTag: {
    position: "absolute",
    top: 12,
    left: 12,
    background: palette.maroon,
    color: "#fff",
    fontSize: 9,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "3px 9px",
    borderRadius: 20,
    fontWeight: 500,
  },
  cardBody: {
    padding: "18px 20px 20px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  cardName: {
    fontWeight: 500,
    fontSize: 15,
  },
  cardPrice: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontWeight: 600,
    color: palette.maroon,
  },
  cardDesc: {
    fontSize: 12,
    color: palette.textMuted,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  addBtn: {
    width: "100%",
    background: palette.maroon,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "11px 0",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "background 0.25s ease",
  },
  addBtnAdded: {
    background: "#3a7d4c",
  },

  // Editorial
  editorial: {
    background: palette.maroon,
    padding: "80px 8%",
    textAlign: "center",
  },
  editorialInner: {
    maxWidth: 680,
    margin: "0 auto",
  },
  editorialQuote: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(22px, 3.5vw, 36px)",
    fontWeight: 400,
    fontStyle: "italic",
    color: "#fff",
    lineHeight: 1.5,
    marginBottom: 20,
  },
  editorialAuthor: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
  },

  // Newsletter
  newsletter: {
    padding: "80px 6%",
    textAlign: "center",
    background: palette.beigeLight,
    borderTop: `1px solid ${palette.beige}`,
    borderBottom: `1px solid ${palette.beige}`,
  },
  newsletterTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 400,
    marginBottom: 10,
  },
  newsletterSub: {
    color: palette.textMuted,
    fontSize: 14,
    marginBottom: 32,
  },
  newsletterForm: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  input: {
    border: `1px solid ${palette.beigeDark}`,
    background: palette.white,
    padding: "12px 20px",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    minWidth: 260,
    color: palette.text,
  },

  // Footer
  footer: {
    background: palette.text,
    color: "rgba(255,255,255,0.7)",
    padding: "56px 6% 32px",
  },
  footerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 32,
    marginBottom: 48,
    paddingBottom: 40,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  footerTagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    marginTop: 8,
    letterSpacing: "0.06em",
  },
  footerLinks: {
    display: "flex",
    gap: 28,
    flexWrap: "wrap",
  },
  footerLink: {
    color: "rgba(255,255,255,0.5)",
    textDecoration: "none",
    fontSize: 13,
    letterSpacing: "0.04em",
    transition: "color 0.2s",
  },
  footerBottom: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
    letterSpacing: "0.04em",
  },

  // Shared buttons
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
  btnGhost: {
    color: palette.maroon,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.04em",
    borderBottom: `1px solid ${palette.maroon}`,
    paddingBottom: 2,
  },

  // Modal styles
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    fontStyle: "italic",
    color: palette.textMuted,
    marginBottom: 24,
  },
  modalText: {
    lineHeight: 1.6,
    color: palette.text,
  },
  modalHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontWeight: 600,
    color: palette.maroon,
    marginTop: 24,
    marginBottom: 12,
  },
};
