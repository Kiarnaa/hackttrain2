import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LandingHeader from "../components/LandingHeader";

const pal = {
  white:      "#FAFAF8",
  beige:      "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark:  "#D4C8B4",
  maroon:     "#6B1E2A",
  text:       "#1A1410",
  muted:      "#7A6E64",
  green:      "#3a7d4c",
};

const fmtPrice = (n) =>
  `${(n * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Ar`;

const SHIPPING_THRESHOLD = 200;

function MvolaIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#E4002B"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
        fill="#fff" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        MVola
      </text>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
      stroke={pal.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, count, setIsOpen } = useCart();
  const navigate = useNavigate();

  const [phone, setPhone]       = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (user && items.length === 0 && !confirmed) {
      navigate("/catalogue", { replace: true });
    }
  }, [user, items, confirmed, navigate]);

  if (!user) return null;

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : 5;
  const grandTotal = total + shipping;

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3)  return digits;
    if (digits.length <= 5)  return `${digits.slice(0,3)} ${digits.slice(3)}`;
    if (digits.length <= 8)  return `${digits.slice(0,3)} ${digits.slice(3,5)} ${digits.slice(5)}`;
    return `${digits.slice(0,3)} ${digits.slice(3,5)} ${digits.slice(5,8)} ${digits.slice(8)}`;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
    setPhoneErr("");
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setPhoneErr("Veuillez entrer un numéro MVola valide (10 chiffres).");
      return;
    }
    if (!digits.startsWith("03")) {
      setPhoneErr("Le numéro MVola doit commencer par 034, 038, etc.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: "100vh", background: pal.white, fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
        <LandingHeader />
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "80px 24px", textAlign: "center",
        }}>
          <CheckIcon />
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36, fontWeight: 600, color: pal.text, margin: "24px 0 12px",
          }}>
            Commande confirmée !
          </h1>
          <p style={{ fontSize: 15, color: pal.muted, maxWidth: 420, lineHeight: 1.7, marginBottom: 8 }}>
            Merci {user.name.split(" ")[0]}, votre demande de paiement MVola a été envoyée au{" "}
            <strong style={{ color: pal.text }}>{phone}</strong>.
          </p>
          <p style={{ fontSize: 13, color: pal.muted, marginBottom: 36 }}>
            Veuillez valider le paiement de{" "}
            <strong style={{ color: pal.maroon }}>{fmtPrice(grandTotal)}</strong>{" "}
            sur votre téléphone.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/" style={{
              padding: "12px 28px", background: pal.maroon, color: "#fff",
              borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500,
              letterSpacing: ".04em",
            }}>
              Retour à l'accueil
            </Link>
            <Link to="/mon-compte" style={{
              padding: "12px 28px", background: "none", color: pal.muted,
              borderRadius: 8, textDecoration: "none", fontSize: 14,
              border: `1px solid ${pal.beige}`,
            }}>
              Mon compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: pal.white, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <LandingHeader />

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, color: pal.muted, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>
            <Link to="/catalogue" style={{ color: pal.muted, textDecoration: "none" }}>Catalogue</Link>
            {" → "}
            <Link to="#" onClick={() => { setIsOpen(true); navigate(-1); }} style={{ color: pal.muted, textDecoration: "none" }}>Panier</Link>
            {" → "}
            <span style={{ color: pal.maroon }}>Paiement</span>
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36, fontWeight: 600, color: pal.text,
          }}>
            Finaliser la commande
          </h1>
        </div>

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* ── LEFT: Order summary ── */}
          <div style={{ flex: "1 1 340px" }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 600, color: pal.text, marginBottom: 20,
            }}>
              Récapitulatif ({count} article{count > 1 ? "s" : ""})
            </h2>

            <div style={{
              border: `1px solid ${pal.beige}`,
              borderRadius: 12, overflow: "hidden",
            }}>
              {items.map((item, i) => (
                <div key={item.key} style={{
                  display: "flex", gap: 14, padding: "16px 18px",
                  borderBottom: i < items.length - 1 ? `1px solid ${pal.beigeLight}` : "none",
                  background: pal.white,
                }}>
                  <img src={item.img} alt={item.name} style={{
                    width: 64, height: 78, objectFit: "cover",
                    borderRadius: 6, flexShrink: 0, background: pal.beige,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: pal.muted, marginBottom: 2 }}>{item.category}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: pal.text, marginBottom: 4 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: pal.muted }}>
                      Taille <strong style={{ color: pal.text }}>{item.size}</strong>
                      {" · "}Qté <strong style={{ color: pal.text }}>{item.quantity}</strong>
                    </p>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: pal.text, whiteSpace: "nowrap", paddingTop: 2 }}>
                    {fmtPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div style={{ padding: "16px 18px", background: pal.beigeLight }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: pal.muted, marginBottom: 6 }}>
                  <span>Sous-total</span>
                  <span>{fmtPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: pal.muted, marginBottom: 12 }}>
                  <span>Livraison</span>
                  <span style={{ color: shipping === 0 ? pal.green : pal.text, fontWeight: 500 }}>
                    {shipping === 0 ? "Gratuite" : fmtPrice(shipping)}
                  </span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 16, fontWeight: 600, color: pal.text,
                  borderTop: `1px solid ${pal.beige}`, paddingTop: 12,
                }}>
                  <span>Total</span>
                  <span style={{ color: pal.maroon }}>{fmtPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Payment ── */}
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 600, color: pal.text, marginBottom: 20,
            }}>
              Moyen de paiement
            </h2>

            {/* Mvola card */}
            <div style={{
              border: `2px solid ${pal.maroon}`,
              borderRadius: 12, padding: "20px 22px", marginBottom: 24,
              background: pal.white,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <MvolaIcon />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: pal.text }}>MVola</p>
                <p style={{ fontSize: 12, color: pal.muted }}>Paiement mobile sécurisé — Telma</p>
              </div>
              <div style={{
                marginLeft: "auto",
                width: 18, height: 18, borderRadius: "50%",
                border: `2px solid ${pal.maroon}`,
                background: pal.maroon,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
              </div>
            </div>

            {/* Payment form */}
            <form onSubmit={handleConfirm} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Payer info */}
              <div style={{
                background: pal.beigeLight, borderRadius: 10, padding: "14px 16px",
                border: `1px solid ${pal.beige}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: pal.maroon,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif",
                  flexShrink: 0,
                }}>
                  {user.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: pal.text }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: pal.muted }}>{user.email}</p>
                </div>
              </div>

              {/* Phone input */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: pal.text, marginBottom: 8 }}>
                  Numéro MVola
                </label>
                <div style={{
                  display: "flex", alignItems: "center",
                  border: `1.5px solid ${phoneErr ? "#dc3545" : pal.beige}`,
                  borderRadius: 8, overflow: "hidden",
                  background: pal.white,
                  transition: "border-color .2s",
                }}>
                  <span style={{
                    padding: "0 14px", fontSize: 14, color: pal.muted,
                    borderRight: `1px solid ${pal.beige}`,
                    lineHeight: "48px", whiteSpace: "nowrap",
                    background: pal.beigeLight,
                  }}>
                    🇲🇬 +261
                  </span>
                  <input
                    type="tel"
                    placeholder="034 XX XXX XX"
                    value={phone}
                    onChange={handlePhoneChange}
                    style={{
                      flex: 1, border: "none", outline: "none",
                      padding: "0 14px", fontSize: 15,
                      height: 48, background: "transparent",
                      fontFamily: "'DM Sans', sans-serif",
                      color: pal.text, letterSpacing: ".04em",
                    }}
                  />
                </div>
                {phoneErr && (
                  <p style={{ fontSize: 12, color: "#dc3545", marginTop: 6 }}>{phoneErr}</p>
                )}
                <p style={{ fontSize: 12, color: pal.muted, marginTop: 6 }}>
                  Un push de confirmation vous sera envoyé sur ce numéro.
                </p>
              </div>

              {/* Amount reminder */}
              <div style={{
                background: "#fdf8f0",
                border: `1px solid #f0e0c0`,
                borderRadius: 8, padding: "14px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, color: pal.muted }}>Montant à payer</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: pal.maroon }}>{fmtPrice(grandTotal)}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "15px 0",
                  background: loading ? pal.muted : pal.maroon,
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 15, fontWeight: 500, letterSpacing: ".04em",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background .2s",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin .8s linear infinite",
                    }} />
                    Envoi en cours…
                  </>
                ) : (
                  "Confirmer et payer via MVola"
                )}
              </button>

              <p style={{ fontSize: 12, color: pal.muted, textAlign: "center", lineHeight: 1.6 }}>
                En confirmant, vous acceptez que le montant soit débité de votre compte MVola.
                <br />Le paiement API sera activé prochainement.
              </p>
            </form>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
