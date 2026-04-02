import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const pal = {
  white:     "#FAFAF8",
  beige:     "#E8E0D0",
  beigeLight:"#F2EDE4",
  beigeDark: "#D4C8B4",
  maroon:    "#6B1E2A",
  text:      "#1A1410",
  muted:     "#7A6E64",
};

const fmtPrice = (n) =>
  `${(n * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Ar`;

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function CartDrawer() {
  const { items, removeItem, updateQty, count, total, isOpen, setIsOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setOrdered(false);
  };

  const handleCommander = () => {
    if (!user) {
      handleClose();
      navigate("/login");
      return;
    }
    setOrdered(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity .25s ease",
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(420px, 100vw)",
        background: pal.white,
        boxShadow: "-4px 0 32px rgba(0,0,0,.12)",
        zIndex: 9999,
        display: "flex", flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: `1px solid ${pal.beige}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: pal.text }}>
              Mon Panier
            </span>
            {count > 0 && (
              <span style={{
                background: pal.maroon, color: "#fff",
                borderRadius: "50%", width: 22, height: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600,
              }}>{count}</span>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: pal.muted, padding: 4,
              display: "flex", alignItems: "center",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: pal.muted }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke={pal.beigeDark} strokeWidth="1.2" strokeLinecap="round"
                style={{ display: "block", margin: "0 auto 16px" }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{ fontSize: 15, color: pal.muted }}>Votre panier est vide</p>
              <p style={{ fontSize: 13, color: pal.beigeDark, marginTop: 6 }}>
                Ajoutez des articles pour commencer.
              </p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.key} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "14px 0",
                borderBottom: `1px solid ${pal.beigeLight}`,
              }}>
                {/* Thumbnail */}
                <img src={item.img} alt={item.name} style={{
                  width: 72, height: 88,
                  objectFit: "cover",
                  borderRadius: 6,
                  flexShrink: 0,
                  background: pal.beige,
                }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: pal.muted, marginBottom: 2 }}>{item.category}</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: pal.text, marginBottom: 4 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: pal.muted, marginBottom: 10 }}>
                    Taille&nbsp;<strong style={{ color: pal.text }}>{item.size}</strong>
                  </p>

                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      display: "flex", alignItems: "center",
                      border: `1px solid ${pal.beige}`, borderRadius: 6,
                      overflow: "hidden",
                    }}>
                      <button
                        onClick={() => updateQty(item.key, -1)}
                        style={{
                          background: "none", border: "none",
                          width: 28, height: 28, cursor: "pointer",
                          color: pal.text, fontSize: 16, lineHeight: 1,
                        }}
                      >−</button>
                      <span style={{
                        padding: "0 10px", fontSize: 14, color: pal.text,
                        borderLeft: `1px solid ${pal.beige}`,
                        borderRight: `1px solid ${pal.beige}`,
                        lineHeight: "28px",
                      }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.key, +1)}
                        style={{
                          background: "none", border: "none",
                          width: 28, height: 28, cursor: "pointer",
                          color: pal.text, fontSize: 16, lineHeight: 1,
                        }}
                      >+</button>
                    </div>

                    <button
                      onClick={() => removeItem(item.key)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: pal.muted, padding: 4,
                        display: "flex", alignItems: "center",
                      }}
                      title="Retirer"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={{
                  fontSize: 14, fontWeight: 500, color: pal.text,
                  whiteSpace: "nowrap", paddingTop: 2,
                }}>
                  {fmtPrice(item.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: total + checkout */}
        {items.length > 0 && (
          <div style={{
            padding: "20px 24px",
            borderTop: `1px solid ${pal.beige}`,
            background: pal.white,
          }}>
            {/* Subtotal */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: 6, fontSize: 13, color: pal.muted,
            }}>
              <span>Sous-total ({count} article{count > 1 ? "s" : ""})</span>
              <span>{fmtPrice(total)}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: 20, fontSize: 13, color: pal.muted,
            }}>
              <span>Livraison</span>
              <span style={{ color: "#3a7d4c", fontWeight: 500 }}>
                {total >= 50 ? "Gratuite" : fmtPrice(5)}
              </span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: 20,
              fontSize: 17, fontWeight: 600, color: pal.text,
              borderTop: `1px solid ${pal.beige}`, paddingTop: 14,
            }}>
              <span>Total</span>
              <span>{fmtPrice(total >= 50 ? total : total + 5)}</span>
            </div>

            {ordered ? (
              <div style={{
                background: "#3a7d4c", color: "#fff",
                borderRadius: 8, padding: "16px",
                textAlign: "center", fontSize: 14, fontWeight: 500,
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>✓</div>
                Commande reçue ! Merci {user?.name?.split(" ")[0]}.
                <div style={{ fontSize: 12, marginTop: 4, opacity: .8 }}>Nous vous contacterons bientôt.</div>
              </div>
            ) : (
              <button
                onClick={handleCommander}
                style={{
                  width: "100%", padding: "14px 0",
                  background: pal.maroon, color: "#fff",
                  border: "none", borderRadius: 8,
                  fontSize: 15, fontWeight: 500,
                  letterSpacing: ".04em", cursor: "pointer",
                }}
              >
                {user ? "Commander →" : "Se connecter pour commander"}
              </button>
            )}
            <button
              onClick={handleClose}
              style={{
                width: "100%", padding: "10px 0", marginTop: 10,
                background: "none", color: pal.muted,
                border: `1px solid ${pal.beige}`, borderRadius: 8,
                fontSize: 14, cursor: "pointer",
              }}
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
