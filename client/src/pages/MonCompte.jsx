import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const fmtPrice = (n) =>
  `${(n * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Ar`;

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24"
      fill={pal.maroon} stroke={pal.maroon} strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}

export default function MonCompte() {
  const { user, logout } = useAuth();
  const { items: wishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: pal.white, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <LandingHeader />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px 80px" }}>

        {/* Profile card */}
        <div style={{
          background: pal.beigeLight,
          border: `1px solid ${pal.beige}`,
          borderRadius: 16,
          padding: "36px 40px",
          display: "flex",
          alignItems: "center",
          gap: 32,
          marginBottom: 52,
          flexWrap: "wrap",
        }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: pal.maroon,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28, fontWeight: 600, color: "#fff",
            flexShrink: 0,
            letterSpacing: ".04em",
          }}>
            {initials(user.name)}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 30, fontWeight: 600,
              color: pal.text, marginBottom: 6,
            }}>
              {user.name}
            </h1>
            <p style={{ fontSize: 14, color: pal.muted }}>{user.email}</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 24px",
              background: "none",
              border: `1.5px solid ${pal.beigeDark}`,
              borderRadius: 8,
              color: pal.muted,
              fontSize: 13, cursor: "pointer",
              letterSpacing: ".04em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Se déconnecter
          </button>
        </div>

        {/* Wishlist section */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26, fontWeight: 600, color: pal.text,
            }}>
              Ma Liste de Souhaits
            </h2>
            <span style={{
              background: pal.maroon, color: "#fff",
              borderRadius: "50%", width: 24, height: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600,
            }}>
              {wishlist.length}
            </span>
          </div>

          {wishlist.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 24px",
              border: `1px dashed ${pal.beigeDark}`,
              borderRadius: 12, color: pal.muted,
            }}>
              <HeartIcon />
              <p style={{ marginTop: 16, fontSize: 15 }}>Aucun article sauvegardé pour l'instant.</p>
              <Link
                to="/catalogue"
                style={{
                  display: "inline-block", marginTop: 16,
                  color: pal.maroon, fontSize: 13,
                  letterSpacing: ".04em", textDecoration: "none",
                }}
              >
                Parcourir le catalogue →
              </Link>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 20,
            }}>
              {wishlist.map(product => (
                <Link
                  key={product.id}
                  to="/catalogue"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{
                    background: pal.beigeLight,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `1px solid ${pal.beige}`,
                    transition: "box-shadow .2s",
                  }}>
                    <img
                      src={product.img}
                      alt={product.name}
                      style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                    />
                    <div style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: 12, color: pal.muted, marginBottom: 3 }}>{product.sub}</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: pal.text, marginBottom: 6 }}>{product.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: pal.text }}>{fmtPrice(product.price)}</span>
                        {product.oldPrice && (
                          <span style={{ fontSize: 11, color: pal.muted, textDecoration: "line-through" }}>{fmtPrice(product.oldPrice)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
