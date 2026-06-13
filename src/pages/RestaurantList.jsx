import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../services/restaurantService";

const COLORS = {
  primary: "#E63946",
  primaryDark: "#C1121F",
  accent: "#FF9F1C",
  dark: "#1A1A2E",
  darker: "#0F0F1A",
  textLight: "#F8F9FA",
  textMuted: "#6c757d",
  bg: "#FFF8F0",
};

const FOOD_EMOJIS = ["🍕", "🍔", "🍜", "🍱", "🌮", "🍛", "🥗", "🍣", "🍗", "🥙"];
const BG_GRADIENTS = [
  "linear-gradient(135deg, #1A1A2E, #2a0a0a)",
  "linear-gradient(135deg, #0F0F1A, #1a0a1a)",
  "linear-gradient(135deg, #0a1a2a, #1A1A2E)",
  "linear-gradient(135deg, #1a0f0a, #2a1a0a)",
  "linear-gradient(135deg, #0a1a0a, #0F0F1A)",
];

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error("Restaurants fetch nahi hue!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Noto Sans', sans-serif", margin: 0, padding: 0, background: COLORS.bg, minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", background: COLORS.darker,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <h1
          onClick={() => navigate("/")}
          style={{ color: COLORS.primary, margin: 0, fontSize: "2.2rem", fontWeight: "900", letterSpacing: "3px", cursor: "pointer" }}
        >
          🍛 KHAO
        </h1>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          {[
            { label: "👤 Profile", path: "/profile" },
            { label: "📦 Orders", path: "/orders" },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.path)} style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: COLORS.textLight,
              padding: "0.5rem 1.2rem",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >{item.label}</button>
          ))}
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} style={{
            padding: "0.5rem 1.2rem",
            background: COLORS.primary,
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "0.9rem",
          }}
            onMouseOver={e => e.currentTarget.style.background = COLORS.primaryDark}
            onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
          >Logout</button>
        </div>
      </nav>

      {/* Search Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.darker} 0%, ${COLORS.dark} 60%, #2a0a0a 100%)`,
        padding: "3rem 3rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", background: "rgba(230,57,70,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-30px", width: "180px", height: "180px", background: "rgba(255,159,28,0.06)", borderRadius: "50%" }} />

        <div style={{
          display: "inline-block",
          background: COLORS.primary + "33",
          color: "#FF6B6B",
          border: `1px solid ${COLORS.primary}55`,
          padding: "5px 16px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "600",
          marginBottom: "1rem",
          letterSpacing: "1px",
        }}>🍽️ {restaurants.length} Restaurants Available</div>

        <h2 style={{
          fontSize: "2.8rem",
          fontWeight: "900",
          margin: "0 0 0.5rem",
          background: `linear-gradient(90deg, ${COLORS.textLight}, ${COLORS.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>Kya khana hai aaj? 🤤</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2rem" }}>
          Apna favourite restaurant dhundo
        </p>

        <div style={{
          display: "flex",
          maxWidth: "520px",
          margin: "0 auto",
          borderRadius: "14px",
          overflow: "hidden",
          border: `2px solid ${COLORS.primary}`,
          background: "white",
        }}>
          <input
            type="text"
            placeholder="🔍  Restaurant dhundo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "0.9rem 1.5rem", flex: 1, border: "none",
              fontSize: "1rem", outline: "none", color: COLORS.dark, background: "transparent",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              padding: "0 1rem", background: "transparent", border: "none",
              color: COLORS.textMuted, cursor: "pointer", fontSize: "1.2rem",
            }}>✕</button>
          )}
          <button style={{
            padding: "0.9rem 1.5rem", background: COLORS.primary,
            color: "white", border: "none", fontSize: "1rem",
            cursor: "pointer", fontWeight: "700",
          }}>Dhundo</button>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div style={{ padding: "1.5rem 3rem 0" }}>
          <span style={{ color: COLORS.textMuted, fontSize: "0.95rem" }}>
            {search
              ? `"${search}" ke liye ${filtered.length} result${filtered.length !== 1 ? "s" : ""} mile`
              : `Sab restaurants (${filtered.length})`}
          </span>
        </div>
      )}

      {/* Restaurant Cards */}
      <div style={{ padding: "1.5rem 3rem 3rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 3rem", color: COLORS.textMuted }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
            <div style={{ fontWeight: "700", color: COLORS.dark, marginBottom: "0.5rem", fontSize: "1.1rem" }}>
              Restaurants load ho rahe hain...
            </div>
            <div style={{ fontSize: "0.9rem" }}>Thoda wait karo yaar 😄</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 3rem", color: COLORS.textMuted }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😔</div>
            <div style={{ fontWeight: "700", color: COLORS.dark, marginBottom: "0.5rem", fontSize: "1.1rem" }}>
              Koi restaurant nahi mila!
            </div>
            <div style={{ fontSize: "0.9rem" }}>Alag naam se try karo</div>
            <button onClick={() => setSearch("")} style={{
              marginTop: "1.5rem", padding: "0.6rem 1.5rem",
              background: COLORS.primary, color: "white",
              border: "none", borderRadius: "8px",
              cursor: "pointer", fontWeight: "700",
            }}>Sab Dikhao</button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "1.5rem",
          }}>
            {filtered.map((restaurant, idx) => (
              <div
                key={restaurant.id}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: hoveredCard === restaurant.id ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                  transform: hoveredCard === restaurant.id ? "translateY(-6px)" : "none",
                  boxShadow: hoveredCard === restaurant.id
                    ? `0 16px 40px ${COLORS.primary}22`
                    : "0 4px 20px rgba(0,0,0,0.07)",
                  transition: "all 0.25s",
                }}
                onMouseOver={() => setHoveredCard(restaurant.id)}
                onMouseOut={() => setHoveredCard(null)}
              >
                <div style={{
                  height: "160px",
                  background: BG_GRADIENTS[idx % BG_GRADIENTS.length],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "4rem", position: "relative",
                }}>
                  {FOOD_EMOJIS[idx % FOOD_EMOJIS.length]}
                  <div style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: COLORS.accent, color: "white",
                    padding: "4px 10px", borderRadius: "20px",
                    fontSize: "0.75rem", fontWeight: "700",
                  }}>⚡ 30 min</div>
                </div>

                <div style={{ padding: "1rem 1.2rem 1.2rem" }}>
                  <h3 style={{ margin: "0 0 0.4rem", color: COLORS.dark, fontSize: "1.05rem", fontWeight: "800" }}>
                    {restaurant.name}
                  </h3>
                  <p style={{ margin: "0 0 0.8rem", color: COLORS.textMuted, fontSize: "0.85rem" }}>
                    📍 {restaurant.address || "Address not available"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      background: "#FFF3E0", color: "#E65100",
                      padding: "4px 10px", borderRadius: "8px",
                      fontSize: "0.82rem", fontWeight: "700",
                    }}>⭐ {restaurant.rating || "4.0"}</span>
                    <span style={{
                      color: hoveredCard === restaurant.id ? COLORS.primary : COLORS.textMuted,
                      fontSize: "0.85rem", fontWeight: "700", transition: "color 0.2s",
                    }}>Menu dekho →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default RestaurantList;