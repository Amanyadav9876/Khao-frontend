import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  primary: "#E63946",
  primaryDark: "#C1121F",
  primaryLight: "#FF6B6B",
  accent: "#FF9F1C",
  dark: "#1A1A2E",
  darker: "#0F0F1A",
  textLight: "#F8F9FA",
  textMuted: "#6c757d",
  bg: "#FFF8F0",
};

const styles = {
  global: { fontFamily: "'Segoe UI', 'Noto Sans', sans-serif", margin: 0, padding: 0, background: COLORS.bg, color: COLORS.dark },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 3rem", background: COLORS.darker, position: "sticky", top: 0, zIndex: 100 },
  logo: { color: COLORS.primary, margin: 0, fontSize: "2.2rem", fontWeight: "900", letterSpacing: "3px", display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" },
  logoSpan: { color: COLORS.accent, fontSize: "1rem", fontWeight: "600", background: COLORS.accent + "22", padding: "2px 10px", borderRadius: "20px", marginLeft: "8px" },
  navLinks: { display: "flex", gap: "1rem", alignItems: "center" },
  locationChip: { color: COLORS.textLight, cursor: "pointer", fontSize: "0.9rem", background: "rgba(255,255,255,0.1)", padding: "6px 14px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px" },
  btnOutline: { padding: "0.5rem 1.5rem", border: `2px solid ${COLORS.primary}`, background: "transparent", color: COLORS.primary, borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem", transition: "all 0.2s" },
  btnFilled: { padding: "0.5rem 1.5rem", border: "none", background: COLORS.primary, color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem", transition: "all 0.2s" },
  hero: { background: `linear-gradient(135deg, ${COLORS.darker} 0%, ${COLORS.dark} 60%, #2a0a0a 100%)`, padding: "5rem 3rem 4rem", textAlign: "center", color: "white", position: "relative", overflow: "hidden" },
  heroTag: { display: "inline-block", background: COLORS.primary + "33", color: COLORS.primaryLight, border: `1px solid ${COLORS.primary}55`, padding: "6px 18px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "1.5rem", letterSpacing: "1px" },
  heroTitle: { fontSize: "4rem", margin: "0 0 1rem", fontWeight: "900", lineHeight: 1.1, background: `linear-gradient(90deg, ${COLORS.textLight}, ${COLORS.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: "1.2rem", color: "rgba(255,255,255,0.65)", maxWidth: "500px", margin: "0 auto 2.5rem" },
  searchWrapper: { display: "flex", justifyContent: "center", maxWidth: "580px", margin: "0 auto 3rem", borderRadius: "14px", overflow: "hidden", border: `2px solid ${COLORS.primary}`, background: "white" },
  searchInput: { padding: "1rem 1.5rem", flex: 1, border: "none", fontSize: "1rem", outline: "none", color: COLORS.dark, background: "transparent" },
  searchBtn: { padding: "1rem 2rem", background: COLORS.primary, color: "white", border: "none", fontSize: "1rem", cursor: "pointer", fontWeight: "700", letterSpacing: "0.5px", transition: "background 0.2s" },
  statsRow: { display: "flex", justifyContent: "center", gap: "3rem", marginTop: "2.5rem", flexWrap: "wrap" },
  statItem: { textAlign: "center" },
  statNum: { fontSize: "2.2rem", fontWeight: "900", color: COLORS.accent },
  statLabel: { color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", marginTop: "4px" },
  divider: { width: "40px", height: "2px", background: COLORS.primary, margin: "0 auto 0.5rem", borderRadius: "2px" },
  section: { padding: "4rem 3rem", textAlign: "center" },
  sectionTitle: { fontSize: "2rem", fontWeight: "900", color: COLORS.dark, marginBottom: "0.5rem" },
  sectionSub: { color: COLORS.textMuted, fontSize: "1rem", marginBottom: "2.5rem" },
  catGrid: { display: "flex", justifyContent: "center", gap: "1.2rem", flexWrap: "wrap" },
  catCard: { background: "white", borderRadius: "18px", padding: "1.5rem 1rem", width: "105px", cursor: "pointer", textAlign: "center", border: "2px solid transparent", transition: "all 0.25s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  catEmoji: { fontSize: "2.5rem" },
  catName: { fontSize: "0.82rem", fontWeight: "700", color: COLORS.dark, marginTop: "0.5rem" },
  featureSection: { background: COLORS.darker, padding: "4rem 3rem", textAlign: "center" },
  featureGrid: { display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginTop: "2.5rem" },
  featureCard: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "2rem 1.5rem", width: "210px", textAlign: "center", transition: "all 0.25s" },
  featureIcon: { fontSize: "2.8rem", marginBottom: "1rem", display: "block" },
  featureTitle: { color: COLORS.textLight, fontWeight: "800", fontSize: "1rem", marginBottom: "0.5rem" },
  featureDesc: { color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", lineHeight: 1.5 },
  cta: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, padding: "5rem 3rem", textAlign: "center", color: "white", position: "relative", overflow: "hidden" },
  ctaTitle: { fontSize: "2.5rem", fontWeight: "900", marginBottom: "1rem" },
  ctaSub: { opacity: 0.85, fontSize: "1.1rem", marginBottom: "2.5rem" },
  ctaBtn: { padding: "1rem 3rem", background: "white", color: COLORS.primary, border: "none", borderRadius: "14px", fontSize: "1.1rem", cursor: "pointer", fontWeight: "900", letterSpacing: "0.5px", transition: "transform 0.2s" },
  ctaBadge: { display: "inline-block", background: COLORS.accent, color: "white", padding: "4px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", marginLeft: "10px", verticalAlign: "middle" },
  footer: { background: COLORS.darker, padding: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" },
};

const categories = [
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍔", name: "Burger" },
  { emoji: "🍜", name: "Noodles" },
  { emoji: "🍱", name: "Biryani" },
  { emoji: "🌮", name: "Wraps" },
  { emoji: "🍰", name: "Desserts" },
  { emoji: "☕", name: "Beverages" },
  { emoji: "🥗", name: "Healthy" },
];

const features = [
  { icon: "⚡", title: "Super Fast Delivery", desc: "30 min guaranteed ya order free!" },
  { icon: "🍽️", title: "500+ Restaurants", desc: "Har cuisine, har budget ke liye" },
  { icon: "💳", title: "Secure Payment", desc: "UPI, Cards, Wallets — sab supported" },
  { icon: "🎁", title: "Daily Offers", desc: "Rozana naye deals aur discounts" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [hoveredCat, setHoveredCat] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const isLoggedIn = !!user?.token;
  const name = localStorage.getItem("name") || "User";
  const photo = localStorage.getItem("profilePhoto") || null;
  const role = user?.role;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const goToDashboard = () => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "OWNER") navigate("/owner");
    else navigate("/restaurants");
  };

  return (
    <div style={styles.global}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <h1 style={styles.logo} onClick={() => navigate("/")}>
          🍛 KHAO
          <span style={styles.logoSpan}>BETA</span>
        </h1>
        <div style={styles.navLinks}>
          <span style={styles.locationChip}>📍 Delhi</span>

          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "25px", padding: "0.4rem 1rem 0.4rem 0.4rem",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              >
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: photo ? "transparent" : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", overflow: "hidden", flexShrink: 0,
                  border: `2px solid ${COLORS.primary}`,
                }}>
                  {photo
                    ? <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : "👤"
                  }
                </div>
                <span style={{ color: COLORS.textLight, fontWeight: "700", fontSize: "0.9rem" }}>
                  {name.split(" ")[0]}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
                  {showDropdown ? "▲" : "▼"}
                </span>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  background: "white", borderRadius: "16px",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                  minWidth: "200px", overflow: "hidden", zIndex: 200,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div style={{ padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#FFF8F0" }}>
                    <div style={{ fontWeight: "800", color: COLORS.dark, fontSize: "0.95rem" }}>{name}</div>
                    <div style={{
                      display: "inline-block", marginTop: "4px",
                      background: role === "ADMIN" ? "rgba(131,56,236,0.12)" : role === "OWNER" ? "rgba(255,159,28,0.12)" : "rgba(45,198,83,0.12)",
                      color: role === "ADMIN" ? "#8338EC" : role === "OWNER" ? "#FF9F1C" : "#2DC653",
                      padding: "2px 10px", borderRadius: "10px",
                      fontSize: "0.75rem", fontWeight: "800",
                    }}>{role}</div>
                  </div>

                  {[
                    { emoji: "🍽️", label: "Order Karo", action: goToDashboard },
                    { emoji: "👤", label: "Profile", action: () => { navigate("/profile"); setShowDropdown(false); } },
                    { emoji: "📦", label: "My Orders", action: () => { navigate("/orders"); setShowDropdown(false); } },
                    // Add Restaurant sirf OWNER ko dikhega
                    ...(role === "OWNER" ? [{ emoji: "🏪", label: "Add Restaurant", action: () => { navigate("/add-restaurant"); setShowDropdown(false); } }] : []),
                  ].map((item, i) => (
                    <div key={i} onClick={item.action} style={{
                      padding: "0.75rem 1rem", cursor: "pointer",
                      fontSize: "0.9rem", fontWeight: "600", color: COLORS.dark,
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      transition: "background 0.15s",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                    }}
                      onMouseOver={e => e.currentTarget.style.background = "#FFF0F0"}
                      onMouseOut={e => e.currentTarget.style.background = "white"}
                    >
                      {item.emoji} {item.label}
                    </div>
                  ))}

                  <div onClick={handleLogout} style={{
                    padding: "0.75rem 1rem", cursor: "pointer",
                    fontSize: "0.9rem", fontWeight: "700", color: COLORS.primary,
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    transition: "background 0.15s",
                  }}
                    onMouseOver={e => e.currentTarget.style.background = "#FFF0F0"}
                    onMouseOut={e => e.currentTarget.style.background = "white"}
                  >
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in - Add Restaurant button hata diya */
            <>
              <button onClick={() => navigate("/login")} style={styles.btnOutline}
                onMouseOver={e => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = "white"; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.primary; }}
              >Login</button>
              <button onClick={() => navigate("/signup")} style={styles.btnFilled}
                onMouseOver={e => e.currentTarget.style.background = COLORS.primaryDark}
                onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
              >Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroTag}>🔥 India's #1 Food Delivery App</div>
        <h2 style={styles.heroTitle}>Bhook Lagi? 🍔<br />Hum Laaye!</h2>
        <p style={styles.heroSub}>Ghar baithe order karo — Fresh, Fast & Affordable!</p>
        <div style={styles.searchWrapper}>
          <input type="text" placeholder="🔍  Restaurant ya food dhundo..."
            value={search} onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
          <button onClick={() => navigate(isLoggedIn ? "/restaurants" : "/login")} style={styles.searchBtn}
            onMouseOver={e => e.currentTarget.style.background = COLORS.primaryDark}
            onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
          >Dhundo →</button>
        </div>
        <div style={styles.statsRow}>
          {[{ num: "500+", label: "Restaurants" }, { num: "50K+", label: "Happy Customers" }, { num: "30 min", label: "Avg Delivery" }].map((s, i) => (
            <div key={i} style={styles.statItem}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.divider}></div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Kya khana hai aaj? 🤤</h3>
        <p style={styles.sectionSub}>Apni favourite category chuniye</p>
        <div style={styles.catGrid}>
          {categories.map((cat, i) => (
            <div key={i} onClick={() => navigate(isLoggedIn ? "/restaurants" : "/login")}
              style={{ ...styles.catCard, border: hoveredCat === i ? `2px solid ${COLORS.primary}` : "2px solid transparent", transform: hoveredCat === i ? "translateY(-6px)" : "none", boxShadow: hoveredCat === i ? `0 12px 32px ${COLORS.primary}22` : "0 2px 12px rgba(0,0,0,0.06)" }}
              onMouseOver={() => setHoveredCat(i)} onMouseOut={() => setHoveredCat(null)}
            >
              <div style={styles.catEmoji}>{cat.emoji}</div>
              <div style={{ ...styles.catName, color: hoveredCat === i ? COLORS.primary : COLORS.dark }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={styles.featureSection}>
        <h3 style={{ ...styles.sectionTitle, color: "white" }}>Kyun choose karein KHAO? 💚</h3>
        <p style={{ ...styles.sectionSub, color: "rgba(255,255,255,0.4)" }}>Sirf delivery nahi — ek poora experience</p>
        <div style={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i}
              style={{ ...styles.featureCard, background: hoveredFeature === i ? "rgba(230,57,70,0.12)" : "rgba(255,255,255,0.05)", border: hoveredFeature === i ? `1px solid ${COLORS.primary}55` : "1px solid rgba(255,255,255,0.1)", transform: hoveredFeature === i ? "translateY(-4px)" : "none" }}
              onMouseOver={() => setHoveredFeature(i)} onMouseOut={() => setHoveredFeature(null)}
            >
              <span style={styles.featureIcon}>{f.icon}</span>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "250px", height: "250px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-40px", width: "200px", height: "200px", background: "rgba(0,0,0,0.1)", borderRadius: "50%" }} />
        <h3 style={styles.ctaTitle}>Ready ho? Abhi order karo! 🚀 <span style={styles.ctaBadge}>20% OFF</span></h3>
        <p style={styles.ctaSub}>Sign up karo aur pehle order pe guaranteed discount pao!</p>
        <button onClick={() => navigate(isLoggedIn ? "/restaurants" : "/signup")} style={styles.ctaBtn}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        >Get Started 🍕</button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>© 2024 KHAO — Made with ❤️ in India</div>

    </div>
  );
};

export default Home;
