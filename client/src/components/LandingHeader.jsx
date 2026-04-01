import { Link, useLocation } from "react-router-dom";

const palette = {
  white: "#FAFAF8",
  beige: "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark: "#D4C8B4",
  maroon: "#6B1E2A",
  text: "#1A1410",
  textMuted: "#7A6E64",
};

export default function LandingHeader() {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Catalogue", to: "/" },
    { label: "À Propos", to: "/" },
    { label: "Connexion", to: "/login" },
  ];

  return (
    <>
      <div style={styles.banner}>
        <span style={styles.bannerDot} />
        <span style={styles.bannerText}>
          Livraison gratuite pour les commandes supérieures à{" "}
          <strong style={{ fontWeight: 700 }}>50.000 MGA</strong> — sans code promo
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
                ...(pathname === to && label === "Connexion" ? styles.navLinkActive : {}),
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
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
};
