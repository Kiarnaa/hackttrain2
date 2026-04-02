import { useState, useEffect } from "react";
import LandingHeader from "../components/LandingHeader";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// ── PALETTE (matches LandingPage) ──────────────────────────────────────────
const p = {
  white:      "#FAFAF8",
  beige:      "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark:  "#D4C8B4",
  maroon:     "#6B1E2A",
  text:       "#1A1410",
  muted:      "#7A6E64",
  mutedLight: "#A49A90",
};


const CATEGORIES     = ["Tout","Vêtements","Chaussures"];
const CLOTHING_SUBS  = ["Tout","Hauts","Bas","Robes","Manteaux"];
const SHOES_SUBS     = ["Tout","Ballerines","Bottes","Baskets","Sandales"];
const SORT_OPTIONS   = ["En vedette","Prix : Croissant","Prix : Décroissant","Nouveautés"];

const TAG_COLORS = {
  "Nouveau":    { bg: p.maroon,    color: "#fff" },
  "Soldes":     { bg: "#3a7d4c",   color: "#fff" },
  "Best-seller":{ bg: p.beigeDark, color: p.text },
};

const fmtPrice = (n) => `${(n * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Ar`;

// ── ICONS ──────────────────────────────────────────────────────────────────
function BasketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={p.muted} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24"
      fill={filled ? p.maroon : "none"}
      stroke={filled ? p.maroon : p.muted} strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

// ── PRODUCT CARD ───────────────────────────────────────────────────────────
function ProductCard({ product, onOpen, delay }) {
  const { addItem } = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const [hovered,   setHovered]   = useState(false);
  const [added,     setAdded]     = useState(false);
  const [selSize,   setSelSize]   = useState(null);
  const [pickSize,  setPickSize]  = useState(false);
  const [selColor,  setSelColor]  = useState(0);

  const images = [product.img, product.imgHover].filter(Boolean);
  const wished = isWished(product.id);

  const handleAdd = () => {
    if (!selSize) { setPickSize(true); return; }
    addItem(product, selSize);
    setAdded(true);
    setTimeout(() => { setAdded(false); setSelSize(null); }, 1400);
  };

  return (
    <article
      style={{ ...css.card, animationDelay: `${delay}s`, cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPickSize(false); }}
    >
      {/* ── IMAGE ── */}
      <div style={css.imgWrap} onClick={() => onOpen(product)}>
        <img
          src={hovered && selColor === 0 ? (product.imgHover || product.img) : (images[selColor] || product.img)}
          alt={product.name}
          style={{
            ...css.img,
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Tag */}
        {product.tag && (
          <span style={{
            ...css.tag,
            background: TAG_COLORS[product.tag].bg,
            color: TAG_COLORS[product.tag].color,
          }}>
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button
          aria-label="Ajouter aux favoris"
          style={{ ...css.wishBtn, opacity: hovered || wished ? 1 : 0 }}
          onClick={e => { e.stopPropagation(); toggleWish(product); }}
        >
          <HeartIcon filled={wished} />
        </button>

        {/* Add / size overlay */}
        <div style={{
          ...css.overlay,
          opacity:   hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(10px)",
        }}>
          {pickSize && !selSize ? (
            // Size picker
            <div style={css.sizeGrid}>
              {product.sizes.map(sz => (
                <button key={sz} style={css.szBtn}
                  onClick={e => { e.stopPropagation(); setSelSize(sz); setPickSize(false); }}>
                  {sz}
                </button>
              ))}
            </div>
          ) : (
            <button
              style={{
                ...css.addBtn,
                background: added ? "#3a7d4c" : p.maroon,
              }}
              onClick={e => { e.stopPropagation(); handleAdd(); }}
            >
              {added ? "Ajouté au panier ✓" : selSize ? `Ajouter — Taille ${selSize}` : "Choisir la taille"}
            </button>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={css.cardBody}>
        <div style={css.cardRow}>
          <div>
            <p style={css.sub}>{product.sub}</p>
            <p style={css.name}>{product.name}</p>
          </div>
          <div style={css.priceBlock}>
            <span style={css.price}>{fmtPrice(product.price)}</span>
            {product.oldPrice && (
              <span style={css.oldPrice}>{fmtPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>

        <p style={css.desc}>{product.desc}</p>

        <div style={css.footer}>
          {/* Color selector */}
          <div style={{ display: "flex", gap: 5 }}>
            {product.colors.map((c, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setSelColor(i); }}
                title={c}
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: c, border: "none", cursor: "pointer", padding: 0,
                  outline: selColor === i ? `2px solid ${p.maroon}` : `1.5px solid ${c === "#FAFAF8" || c === "#EAE0D0" ? p.beigeDark : "transparent"}`,
                  outlineOffset: 2,
                  transition: "outline .15s",
                }}
              />
            ))}
          </div>
          {selSize && (
            <span style={css.chosenSize}>
              {selSize}
              <button style={css.clearSize} onClick={() => setSelSize(null)}>×</button>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ── PRODUCT MODAL ──────────────────────────────────────────────────────────
function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const [selSize,  setSelSize]  = useState(null);
  const [selColor, setSelColor] = useState(0);
  const [added,    setAdded]    = useState(false);

  const images = [product.img, product.imgHover].filter(Boolean);
  const wished = isWished(product.id);

  const handleColorSelect = (i) => {
    setSelColor(i);
  };

  const handleAdd = () => {
    if (!selSize) return;
    addItem(product, selSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(26,20,16,.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 16px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: p.white,
          borderRadius: 14,
          width: "min(880px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexWrap: "wrap",
          boxShadow: "0 24px 80px rgba(0,0,0,.18)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            background: "rgba(255,255,255,.9)", border: "none", borderRadius: "50%",
            width: 36, height: 36, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: p.text, boxShadow: "0 2px 8px rgba(0,0,0,.12)",
          }}
        >×</button>

        {/* Left — images */}
        <div style={{ flex: "1 1 340px", minHeight: 400, position: "relative" }}>
          <img
            src={images[Math.min(selColor, images.length - 1)]}
            alt={product.name}
            style={{
              width: "100%", height: "100%", minHeight: 400,
              objectFit: "cover",
              borderRadius: "14px 0 0 14px",
              transition: "opacity .2s",
            }}
          />
          {/* Wishlist button on modal image */}
          <button
            onClick={() => toggleWish(product)}
            style={{
              position: "absolute", top: 14, left: 14, zIndex: 5,
              background: "rgba(255,255,255,.9)", border: "none", borderRadius: "50%",
              width: 36, height: 36, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,.12)",
            }}
            title={wished ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <HeartIcon filled={wished} />
          </button>
          {product.tag && (
            <span style={{
              position: "absolute", top: 16, right: 16,
              ...css.tag,
              background: TAG_COLORS[product.tag]?.bg || p.beigeDark,
              color: TAG_COLORS[product.tag]?.color || p.text,
            }}>
              {product.tag}
            </span>
          )}
        </div>

        {/* Right — details */}
        <div style={{
          flex: "1 1 300px", padding: "40px 36px",
          display: "flex", flexDirection: "column", gap: 18,
        }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: p.muted, marginBottom: 6 }}>
              {product.category} · {product.sub}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: p.text, lineHeight: 1.2 }}>
              {product.name}
            </h2>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: p.text }}>{fmtPrice(product.price)}</span>
            {product.oldPrice && (
              <span style={{ fontSize: 15, color: p.muted, textDecoration: "line-through" }}>{fmtPrice(product.oldPrice)}</span>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: p.muted, lineHeight: 1.7 }}>{product.desc}</p>

          {/* Colors */}
          <div>
            <p style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: p.muted, marginBottom: 10 }}>Couleur</p>
            <div style={{ display: "flex", gap: 10 }}>
              {product.colors.map((c, i) => (
                <button
                  key={i} title={c}
                  onClick={() => handleColorSelect(i)}
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: c, border: "none", cursor: "pointer", padding: 0,
                    outline: selColor === i ? `2.5px solid ${p.maroon}` : `1.5px solid ${c === "#FAFAF8" || c === "#EAE0D0" ? p.beigeDark : "transparent"}`,
                    outlineOffset: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,.15)",
                    transition: "outline .15s, transform .15s",
                    transform: selColor === i ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: p.muted, marginBottom: 10 }}>
              Taille {selSize && <span style={{ color: p.maroon, fontWeight: 600 }}>— {selSize}</span>}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.sizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelSize(sz)}
                  style={{
                    padding: "8px 16px", border: "1.5px solid",
                    borderColor: selSize === sz ? p.maroon : p.beige,
                    borderRadius: 6, background: selSize === sz ? p.maroon : "transparent",
                    color: selSize === sz ? "#fff" : p.text,
                    fontSize: 13, cursor: "pointer",
                    transition: "all .15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={!selSize}
            style={{
              width: "100%", padding: "15px 0",
              background: added ? "#3a7d4c" : selSize ? p.maroon : p.beigeDark,
              color: selSize ? "#fff" : p.muted,
              border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 500, letterSpacing: ".04em",
              cursor: selSize ? "pointer" : "not-allowed",
              transition: "background .2s",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: "auto",
            }}
          >
            {added ? "Ajouté au panier ✓" : selSize ? `Ajouter au panier — ${selSize}` : "Sélectionner une taille"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [category,  setCategory]  = useState("Tout");
  const [subFilter, setSubFilter] = useState("Tout");
  const [sort,      setSort]      = useState("En vedette");
  const [sortOpen,  setSortOpen]  = useState(false);
  const [search,    setSearch]    = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible,   setVisible]   = useState(false);
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => { setSubFilter("Tout"); }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/produits');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const produits = data.produits || [];

        const formattedProducts = produits.map(p => ({
          id: p.id_products,
          category: p.category || "Vêtements",
          sub: p.sub || "Hauts",
          name: p.name,
          price: parseFloat(p.price),
          oldPrice: p.old_price ? parseFloat(p.old_price) : null,
          tag: p.tag || null,
          sizes: p.size ? p.size.split(',') : [],
          colors: p.color ? p.color.split(',') : [],
          img: p.image_url,
          imgHover: p.hover_image || p.image_url,
          desc: p.description
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const subs = category === "Vêtements" ? CLOTHING_SUBS
             : category === "Chaussures" ? SHOES_SUBS
             : [];

  const filtered = products
    .filter(pr => {
      if (category !== "Tout" && pr.category !== category) return false;
      if (subFilter !== "Tout" && pr.sub !== subFilter)    return false;
      if (search && !pr.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Prix : Croissant")  return a.price - b.price;
      if (sort === "Prix : Décroissant")  return b.price - a.price;
      if (sort === "Nouveautés")     return (b.tag === "Nouveau" ? 1 : 0) - (a.tag === "Nouveau" ? 1 : 0);
      return 0;
    });

  return (
    <div style={css.root}>
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* ── FONTS + KEYFRAMES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${p.white}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        a:hover { color: ${p.maroon} !important; }
      `}</style>

      <LandingHeader />

      {/* ── PAGE TITLE HERO ── */}
      <div style={{
        ...css.pageHero,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        transition: "opacity .8s ease, transform .8s ease",
      }}>
        <div style={css.heroLeft}>
          <p style={css.eyebrow}>Printemps · Été 2026</p>
          <h1 style={css.pageTitle}>
            La&nbsp;<em style={css.titleItalic}>Collection</em>
          </h1>
          <p style={css.pageSub}>
            Vêtements et chaussures conçus pour durer — en savoir-faire, confort et élégance discrète.
          </p>
        </div>
        {/* decorative arc */}
        <svg style={css.arc} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="160" fill="none" stroke={p.beigeDark} strokeWidth="1" opacity=".6"/>
          <circle cx="200" cy="200" r="120" fill="none" stroke={p.beigeDark} strokeWidth="1" opacity=".4"/>
          <circle cx="200" cy="200" r="80"  fill="none" stroke={p.beigeDark} strokeWidth="1" opacity=".2"/>
        </svg>
      </div>

      {/* ── TOOLBAR ── */}
      <div style={css.toolbar}>
        {/* Search */}
        <div style={css.searchWrap}>
          <span style={css.searchIcon}><SearchIcon /></span>
          <input
            type="text" placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={css.searchInput}
          />
        </div>

        {/* Category pills */}
        <div style={css.pillRow}>
          {CATEGORIES.map(cat => (
            <button key={cat} style={{
              ...css.pill,
              ...(category === cat ? css.pillActive : {}),
            }} onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <button style={css.sortBtn} onClick={() => setSortOpen(o => !o)}>
            <span style={{ color: p.mutedLight, fontSize: 11, letterSpacing: ".05em" }}>Trier&nbsp;</span>
            {sort}
            <ChevronDown />
          </button>
          {sortOpen && (
            <div style={css.dropdown}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt} style={{
                  ...css.dropOpt,
                  ...(sort === opt ? css.dropOptActive : {}),
                }} onClick={() => { setSort(opt); setSortOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SUB-FILTER ── */}
      {subs.length > 0 && (
        <div style={css.subRow}>
          {subs.map(sub => (
            <button key={sub} style={{
              ...css.subPill,
              ...(subFilter === sub ? css.subPillActive : {}),
            }} onClick={() => setSubFilter(sub)}>{sub}</button>
          ))}
        </div>
      )}

      {/* ── RESULT COUNT ── */}
      <div style={css.countRow}>
        <span style={css.countText}>{filtered.length} {filtered.length === 1 ? "produit" : "produits"}</span>
        <div style={css.rule} />
      </div>

      {/* ── GRID ── */}
      <main style={css.grid}>
        {filtered.length === 0 ? (
          <div style={css.empty}>
            <p style={css.emptyTitle}>Aucun produit trouvé</p>
            <p style={css.emptySub}>Essayez de modifier vos filtres ou votre recherche.</p>
            <button style={css.emptyBtn}
              onClick={() => { setCategory("Tout"); setSearch(""); setSubFilter("Tout"); }}>
              Effacer les filtres
            </button>
          </div>
        ) : filtered.map((pr, i) => (
          <ProductCard
            key={pr.id}
            product={pr}
            delay={Math.min(i * 0.065, 0.45)}
            onOpen={setSelectedProduct}
          />
        ))}
      </main>

      {/* ── EDITORIAL STRIP ── */}
      <div style={css.editorial}>
        <p style={css.editorialQ}>
          « Chaque pièce est conçue pour être portée des années, pas des saisons. »
        </p>
        <a href="/about" style={css.editorialLink}>Découvrir nos artisans →</a>
      </div>

      {/* ── FOOTER ── */}
      <footer style={css.footerWrap}>
        <div style={css.footerTop}>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: ".08em", color: "rgba(255,255,255,.85)" }}>
              ETHKL
            </span>
            <p style={css.footerTagline}>Des objets qui méritent d’être gardés.</p>
          </div>
          <div style={css.footerLinks}>
            {["Boutique","À Propos","Durabilité","Contact","FAQ"].map(l => (
              <a key={l} href="#" style={css.footerLink}>{l}</a>
            ))}
          </div>
        </div>
        <div style={css.footerBottom}>
          <span>© 2026 ETHKL. Tous droits réservés.</span>
          <span>Fait avec intention.</span>
        </div>
      </footer>
    </div>
  );
}

// ── STYLE OBJECT ───────────────────────────────────────────────────────────
const css = {
  root: { fontFamily: "'DM Sans', sans-serif", background: p.white, color: p.text },

  // Banner
  banner: {
    background: p.maroon, color: "#fff",
    textAlign: "center", padding: "10px 16px",
    fontSize: 13, letterSpacing: ".04em",
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: 12, fontWeight: 300,
  },
  dot: { width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.4)", display: "inline-block" },

  // Header
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(250,250,248,.93)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${p.beige}`,
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%", height: 64,
  },
  logo: { display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: p.text },
  logoMark: { color: p.maroon, fontSize: 14 },
  logoText: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: ".08em" },
  nav: { display: "flex", gap: 36 },
  navLink: { textDecoration: "none", color: p.muted, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase" },
  navActive: { color: p.text, borderBottom: `1px solid ${p.text}`, paddingBottom: 2 },
  basketBtn: {
    background: "none", border: "none", cursor: "pointer",
    position: "relative", color: p.text, padding: 4,
    display: "flex", alignItems: "center",
  },
  badge: {
    position: "absolute", top: -2, right: -6,
    background: p.maroon, color: "#fff",
    borderRadius: "50%", width: 16, height: 16,
    fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600,
  },

  // Hero
  pageHero: {
    padding: "64px 6% 48px",
    background: `linear-gradient(140deg, ${p.beigeLight} 0%, ${p.white} 65%)`,
    borderBottom: `1px solid ${p.beige}`,
    position: "relative", overflow: "hidden",
    display: "flex", alignItems: "center",
  },
  heroLeft: { maxWidth: 520, position: "relative", zIndex: 2 },
  eyebrow: { fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: p.maroon, marginBottom: 16, fontWeight: 500 },
  pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,5vw,68px)", fontWeight: 400, lineHeight: 1.06, marginBottom: 16 },
  titleItalic: { fontStyle: "italic", color: p.maroon },
  pageSub: { fontSize: 14, color: p.muted, lineHeight: 1.75, maxWidth: 400, fontWeight: 300 },
  arc: {
    position: "absolute", right: "-2%", top: "50%",
    transform: "translateY(-50%)",
    width: "min(45vw, 400px)", opacity: .7, pointerEvents: "none",
  },

  // Toolbar
  toolbar: {
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14,
    padding: "18px 6%", borderBottom: `1px solid ${p.beige}`,
  },
  searchWrap: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 11, pointerEvents: "none", display: "flex" },
  searchInput: {
    border: `1px solid ${p.beige}`, background: p.white,
    padding: "8px 14px 8px 32px", borderRadius: 8,
    fontSize: 13, outline: "none",
    fontFamily: "'DM Sans', sans-serif", color: p.text, width: 180,
  },
  pillRow: { display: "flex", gap: 8 },
  pill: {
    background: "none", border: `1px solid ${p.beigeDark}`,
    borderRadius: 30, padding: "6px 18px",
    fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase",
    cursor: "pointer", color: p.muted,
    fontFamily: "'DM Sans', sans-serif", transition: "all .2s",
  },
  pillActive: { background: p.maroon, border: `1px solid ${p.maroon}`, color: "#fff" },
  sortBtn: {
    background: "none", border: `1px solid ${p.beige}`, borderRadius: 8,
    padding: "8px 12px", fontSize: 13, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 5,
    fontFamily: "'DM Sans', sans-serif", color: p.text,
  },
  dropdown: {
    position: "absolute", top: "calc(100% + 6px)", right: 0,
    background: p.white, border: `1px solid ${p.beige}`,
    borderRadius: 10, padding: 6, zIndex: 50,
    boxShadow: "0 8px 32px rgba(0,0,0,.08)", minWidth: 190,
  },
  dropOpt: {
    display: "block", width: "100%", textAlign: "left",
    background: "none", border: "none", padding: "9px 14px",
    fontSize: 13, cursor: "pointer", borderRadius: 6,
    fontFamily: "'DM Sans', sans-serif", color: p.text,
  },
  dropOptActive: { background: p.beigeLight, color: p.maroon, fontWeight: 500 },

  // Sub filter
  subRow: {
    display: "flex", gap: 8, flexWrap: "wrap",
    padding: "12px 6%", borderBottom: `1px solid ${p.beige}`,
    background: p.beigeLight,
  },
  subPill: {
    background: "none", border: `1px solid ${p.beigeDark}`,
    borderRadius: 20, padding: "5px 15px",
    fontSize: 11, letterSpacing: ".07em", textTransform: "uppercase",
    cursor: "pointer", color: p.muted,
    fontFamily: "'DM Sans', sans-serif", transition: "all .2s",
  },
  subPillActive: { background: p.text, border: `1px solid ${p.text}`, color: "#fff" },

  // Count
  countRow: { display: "flex", alignItems: "center", gap: 16, padding: "16px 6% 0" },
  countText: { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: p.mutedLight, whiteSpace: "nowrap" },
  rule: { flex: 1, height: 1, background: p.beige },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 28, padding: "24px 6% 80px",
  },

  // Card
  card: {
    background: p.white, border: `1px solid ${p.beige}`,
    borderRadius: 16, overflow: "hidden", cursor: "pointer",
    animation: "fadeUp .55s ease both",
    transition: "transform .3s ease, box-shadow .3s ease",
  },
  imgWrap: { position: "relative", height: 320, overflow: "hidden", background: p.beigeLight },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s cubic-bezier(.22,1,.36,1)" },
  tag: { position: "absolute", top: 12, left: 12, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, fontWeight: 500 },
  wishBtn: {
    position: "absolute", top: 10, right: 10,
    background: "rgba(250,250,248,.88)", backdropFilter: "blur(4px)",
    border: `1px solid ${p.beige}`, borderRadius: "50%",
    width: 34, height: 34,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "opacity .25s",
  },
  overlay: {
    position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 12px",
    background: `linear-gradient(transparent, rgba(250,250,248,.97) 38%)`,
    transition: "opacity .25s, transform .25s",
  },
  sizeGrid: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" },
  szBtn: {
    background: p.white, border: `1px solid ${p.beigeDark}`,
    borderRadius: 6, padding: "5px 10px", fontSize: 11,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", color: p.text,
  },
  addBtn: {
    width: "100%", color: "#fff", border: "none", borderRadius: 8,
    padding: "11px 0", fontSize: 11, letterSpacing: ".08em",
    textTransform: "uppercase", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "background .25s",
  },

  // Card body
  cardBody: { padding: "16px 18px 18px" },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  sub: { fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.mutedLight, marginBottom: 3 },
  name: { fontSize: 14, fontWeight: 500 },
  priceBlock: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 },
  price: { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: p.maroon },
  oldPrice: { fontSize: 11, color: p.mutedLight, textDecoration: "line-through" },
  desc: { fontSize: 12, color: p.muted, lineHeight: 1.6, marginBottom: 12 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  swatches: { display: "flex", gap: 6 },
  swatch: { width: 13, height: 13, borderRadius: "50%", display: "inline-block", boxShadow: "0 0 0 1px rgba(0,0,0,.05)" },
  chosenSize: {
    fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase",
    color: p.maroon, fontWeight: 500, display: "flex", alignItems: "center", gap: 4,
  },
  clearSize: {
    background: "none", border: "none", color: p.muted,
    cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0,
  },

  // Empty
  empty: { gridColumn: "1/-1", textAlign: "center", padding: "80px 0" },
  emptyTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 10 },
  emptySub: { color: p.muted, fontSize: 14, marginBottom: 28 },
  emptyBtn: {
    background: p.maroon, color: "#fff", border: "none", borderRadius: 8,
    padding: "12px 24px", fontSize: 12, letterSpacing: ".08em",
    textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },

  // Editorial
  editorial: {
    background: p.maroon, padding: "48px 6%",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", flexWrap: "wrap", gap: 16,
  },
  editorialQ: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(18px,2.5vw,28px)",
    fontStyle: "italic", color: "#fff", fontWeight: 400,
  },
  editorialLink: {
    color: "rgba(255,255,255,.6)", textDecoration: "none",
    fontSize: 13, letterSpacing: ".06em",
    borderBottom: "1px solid rgba(255,255,255,.3)", paddingBottom: 2, whiteSpace: "nowrap",
  },

  // Footer
  footerWrap: { background: p.text, color: "rgba(255,255,255,.65)", padding: "56px 6% 32px" },
  footerTop: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    flexWrap: "wrap", gap: 32, marginBottom: 48, paddingBottom: 40,
    borderBottom: "1px solid rgba(255,255,255,.1)",
  },
  footerTagline: { fontSize: 12, color: "rgba(255,255,255,.3)", marginTop: 8, letterSpacing: ".06em" },
  footerLinks: { display: "flex", gap: 28, flexWrap: "wrap" },
  footerLink: { color: "rgba(255,255,255,.45)", textDecoration: "none", fontSize: 13, letterSpacing: ".04em" },
  footerBottom: {
    display: "flex", justifyContent: "space-between", flexWrap: "wrap",
    gap: 8, fontSize: 11, color: "rgba(255,255,255,.22)", letterSpacing: ".04em",
  },
};
