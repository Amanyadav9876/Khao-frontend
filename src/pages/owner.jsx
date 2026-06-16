import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Owner = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hoveredCard, setHoveredCard] = useState(null);

  const name = localStorage.getItem("name") || "Owner";
  const email = localStorage.getItem("email") || "";
  const photo = localStorage.getItem("profilePhoto") || null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const COLORS = {
    primary: "#E63946",
    primaryDark: "#C1121F",
    accent: "#FF9F1C",
    dark: "#1A1A2E",
    darker: "#0F0F1A",
    textLight: "#F8F9FA",
    bg: "#FFF8F0",
  };

  const tabs = [
    { id: "dashboard", emoji: "📊", label: "Dashboard" },
    { id: "profile", emoji: "👤", label: "Profile" },
    { id: "restaurants", emoji: "🏪", label: "My Restaurants" },
    { id: "orders", emoji: "📦", label: "Orders" },
  ];

  const quickActions = [
    { emoji: "🏪", label: "Add Restaurant", desc: "Naya restaurant add karo", path: "/add-restaurant", color: "#E63946" },
    { emoji: "🍽️", label: "Manage Menu", desc: "Menu items add/edit karo", path: "/owner/menu", color: "#FF9F1C" },
    { emoji: "📦", label: "View Orders", desc: "Incoming orders dekho", path: "/owner/orders", color: "#2DC653" },
    { emoji: "👤", label: "My Profile", desc: "Profile update karo", path: "/profile", color: "#8338EC" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Noto Sans', sans-serif", background: COLORS.bg, minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", background: COLORS.darker,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <h1 onClick={() => navigate("/")} style={{
          color: COLORS.primary, margin: 0, fontSize: "2.2rem",
          fontWeight: "900", letterSpacing: "3px", cursor: "pointer",
        }}>🍛 KHAO</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{
            color: COLORS.accent, fontWeight: "700", fontSize: "0.85rem",
            background: "rgba(255,159,28,0.12)", border: "1px solid rgba(255,159,28,0.3)",
            padding: "4px 14px", borderRadius: "20px",
          }}>🏪 OWNER</span>

          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "25px", padding: "0.4rem 1rem 0.4rem 0.4rem",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: photo ? "transparent" : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", overflow: "hidden",
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
          </div>

          <button onClick={handleLogout} style={{
            padding: "0.5rem 1.2rem",
            background: "transparent", color: COLORS.primary,
            border: `2px solid ${COLORS.primary}`, borderRadius: "8px",
            cursor: "pointer", fontWeight: "700", fontSize: "0.85rem",
          }}>🚪 Logout</button>
        </div>
      </nav>

      {/* Hero Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.darker} 0%, ${COLORS.dark} 60%, #2a0a0a 100%)`,
        padding: "3rem 3rem 4rem", textAlign: "center", color: "white",
      }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: photo ? "transparent" : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", margin: "0 auto 1rem",
          border: "3px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(230,57,70,0.4)",
          overflow: "hidden",
        }}>
          {photo
            ? <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "👤"
          }
        </div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "0 0 0.4rem" }}>
          Namaste, {name.split(" ")[0]}! 👋
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>{email}</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "0.5rem", padding: "1.5rem 3rem 0",
        borderBottom: "2px solid rgba(0,0,0,0.06)",
        background: "white",
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "0.7rem 1.4rem",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === tab.id ? `3px solid ${COLORS.primary}` : "3px solid transparent",
            color: activeTab === tab.id ? COLORS.primary : "#6c757d",
            cursor: "pointer", fontWeight: "700", fontSize: "0.9rem",
            transition: "all 0.2s", marginBottom: "-2px",
          }}>
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 2rem 3rem" }}>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h3 style={{ color: COLORS.dark, fontWeight: "800", marginBottom: "1.5rem" }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.2rem" }}>
              {quickActions.map((action, i) => (
                <div key={i} onClick={() => navigate(action.path)}
                  onMouseOver={() => setHoveredCard(i)}
                  onMouseOut={() => setHoveredCard(null)}
                  style={{
                    background: "white", borderRadius: "20px", padding: "1.8rem 1.5rem",
                    cursor: "pointer", textAlign: "center",
                    border: hoveredCard === i ? `2px solid ${action.color}` : "2px solid transparent",
                    boxShadow: hoveredCard === i ? `0 12px 32px ${action.color}22` : "0 4px 16px rgba(0,0,0,0.08)",
                    transform: hoveredCard === i ? "translateY(-4px)" : "none",
                    transition: "all 0.25s",
                  }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>{action.emoji}</div>
                  <div style={{ fontWeight: "800", color: COLORS.dark, fontSize: "1rem", marginBottom: "0.4rem" }}>
                    {action.label}
                  </div>
                  <div style={{ color: "#6c757d", fontSize: "0.82rem" }}>{action.desc}</div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <h3 style={{ color: COLORS.dark, fontWeight: "800", margin: "2.5rem 0 1.5rem" }}>
              📈 Overview
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
              {[
                { label: "My Restaurants", value: "—", emoji: "🏪" },
                { label: "Total Orders", value: "—", emoji: "📦" },
                { label: "Today's Orders", value: "—", emoji: "🛵" },
                { label: "Revenue", value: "—", emoji: "💰" },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: "white", borderRadius: "16px", padding: "1.5rem",
                  textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{stat.emoji}</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900", color: COLORS.primary }}>{stat.value}</div>
                  <div style={{ color: "#6c757d", fontSize: "0.82rem", marginTop: "0.3rem" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div style={{ background: "white", borderRadius: "24px", padding: "2rem", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: COLORS.dark, fontWeight: "800", marginTop: 0 }}>👤 Profile Info</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: COLORS.dark, display: "block", marginBottom: "0.4rem" }}>Name</label>
              <div style={{ padding: "0.85rem 1rem", border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "10px", color: COLORS.dark }}>{name}</div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: COLORS.dark, display: "block", marginBottom: "0.4rem" }}>Email</label>
              <div style={{ padding: "0.85rem 1rem", border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "10px", color: COLORS.dark }}>{email}</div>
            </div>
            <button onClick={() => navigate("/profile")} style={{
              width: "100%", padding: "0.9rem",
              background: COLORS.primary, color: "white",
              border: "none", borderRadius: "12px",
              cursor: "pointer", fontWeight: "800", fontSize: "1rem",
            }}>✏️ Full Profile Edit Karo</button>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === "restaurants" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ color: COLORS.dark, fontWeight: "800", margin: 0 }}>🏪 My Restaurants</h3>
              <button onClick={() => navigate("/add-restaurant")} style={{
                padding: "0.7rem 1.5rem",
                background: COLORS.primary, color: "white",
                border: "none", borderRadius: "10px",
                cursor: "pointer", fontWeight: "700",
              }}>+ Add Restaurant</button>
            </div>
            <div style={{
              background: "white", borderRadius: "20px", padding: "3rem",
              textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏪</div>
              <p style={{ color: "#6c757d", fontWeight: "600" }}>Abhi tak koi restaurant nahi add kiya.</p>
              <button onClick={() => navigate("/add-restaurant")} style={{
                padding: "0.8rem 2rem",
                background: COLORS.primary, color: "white",
                border: "none", borderRadius: "10px",
                cursor: "pointer", fontWeight: "700", marginTop: "0.5rem",
              }}>🏪 Pehla Restaurant Add Karo</button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h3 style={{ color: COLORS.dark, fontWeight: "800", marginBottom: "1.5rem" }}>📦 Restaurant Orders</h3>
            <div style={{
              background: "white", borderRadius: "20px", padding: "3rem",
              textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
              <p style={{ color: "#6c757d", fontWeight: "600" }}>Abhi koi orders nahi hain.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Owner;
