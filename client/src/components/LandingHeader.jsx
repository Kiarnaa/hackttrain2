import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const palette = {
  white: "#FAFAF8",
  beige: "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark: "#D4C8B4",
  maroon: "#6B1E2A",
  text: "#1A1410",
  textMuted: "#7A6E64",
};

function BasketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function LandingHeader() {
  const { pathname } = useLocation();
  const { count, setIsOpen } = useCart();
  const { user } = useAuth();

  const navItems = [
    { label: "Catalogue", to: "/catalogue" },
    { label: "À Propos", to: "/about" },
    ...(!user ? [{ label: "Connexion", to: "/login" }] : []),
  ];

  return (
    <>
      <div style={styles.banner}>
        <span style={styles.bannerDot} />
        <span style={styles.bannerText}>
          Livraison gratuite pour les commandes supérieures à{" "}
          <strong style={{ fontWeight: 700 }}>200.000 MGA</strong> — sans code promo
        </span>
        <span style={styles.bannerDot} />
      </div>

      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>ETHKL</span>
        </Link>

        <nav style={styles.nav}>
          {navItems.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              style={{
                ...styles.navLink,
                ...(pathname === to && to !== "/" ? styles.navLinkActive : {}),
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && user.name && (
            <Link to="/mon-compte" style={styles.avatarBtn} title={user.name}>
              <span style={styles.avatarCircle}>{initials(user.name)}</span>
              <span style={{ fontSize: 13, color: palette.textMuted, letterSpacing: ".04em" }}>
                {user.name.split(" ")[0]}
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Panier"
            style={styles.basketBtn}
          >
            <BasketIcon />
            {count > 0 && (
              <span style={styles.badge}>{count}</span>
            )}
          </button>
        </div>
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${palette.white}; font-family: 'DM Sans', sans-serif; }
      `}</style>
    </>
  );
}

const styles = {
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
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(250,250,248,0.96)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${palette.beige}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    height: 64,
  },
  logo: {
    textDecoration: "none",
    color: palette.text,
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: palette.text,
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
    textTransform: "uppercase",
    transition: "color 0.2s",
  },
  navLinkActive: {
    color: palette.maroon,
    fontWeight: 500,
  },
  basketBtn: {
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: palette.text,
    display: "flex",
    alignItems: "center",
    padding: 6,
    borderRadius: 6,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    background: palette.maroon,
    color: "#fff",
    borderRadius: "50%",
    width: 18,
    height: 18,
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  avatarBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    padding: "4px 10px 4px 4px",
    borderRadius: 24,
    border: `1px solid ${palette.beigeDark}`,
    background: palette.beigeLight,
    cursor: "pointer",
    transition: "border-color .2s, background .2s",
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: palette.maroon,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: ".04em",
    flexShrink: 0,
  },
};
