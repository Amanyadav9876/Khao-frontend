import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [saved, setSaved] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [photo, setPhoto] = useState(localStorage.getItem("profilePhoto") || null);
  const [hoveredAvatar, setHoveredAvatar] = useState(false);

  const role = localStorage.getItem("role") || "USER";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("profilePhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const inputStyle = (field) => ({
    display: "block", width: "100%",
    padding: "0.85rem 1rem", marginBottom: "1.2rem",
    border: focusedField === field ? "1.5px solid #E63946" : "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: "10px", fontSize: "1rem", outline: "none",
    color: "#1A1A2E", background: "white",
    boxSizing: "border-box", transition: "border 0.2s",
    fontFamily: "'Segoe UI', sans-serif",
  });

  const labelStyle = {
    fontSize: "0.85rem", fontWeight: "700",
    color: "#1A1A2E", display: "block", marginBottom: "0.4rem",
  };

  const quickLinks = [
    { emoji: "📦", label: "My Orders", path: "/orders" },
    { emoji: "🍽️", label: "Browse Restaurants", path: "/restaurants" },
    { emoji: "🏪", label: "Add Restaurant", path: "/add-restaurant" },
  ];

  const roleColors = {
    ADMIN: { bg: "rgba(131,56,236,0.12)", color: "#8338EC", border: "rgba(131,56,236,0.3)" },
    OWNER: { bg: "rgba(255,159,28,0.12)", color: "#FF9F1C", border: "rgba(255,159,28,0.3)" },
    USER: { bg: "rgba(45,198,83,0.12)", color: "#2DC653", border: "rgba(45,198,83,0.3)" },
  };
  const roleStyle = roleColors[role] || roleColors.USER;

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Noto Sans', sans-serif", margin: 0, padding: 0, background: "#FFF8F0", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", background: "#0F0F1A",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <h1 onClick={() => navigate("/restaurants")} style={{
          color: "#E63946", margin: 0, fontSize: "2.2rem",
          fontWeight: "900", letterSpacing: "3px", cursor: "pointer",
        }}>🍛 KHAO</h1>
        <span style={{
          color: "#F8F9FA", fontWeight: "700", fontSize: "0.95rem",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "6px 16px", borderRadius: "20px",
        }}>👤 My Profile</span>
      </nav>

      {/* Header with Avatar */}
      <div style={{
        background: "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 60%, #2a0a0a 100%)",
        padding: "3rem 3rem 5rem",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", background: "rgba(230,57,70,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-50px", left: "-30px", width: "160px", height: "160px", background: "rgba(255,159,28,0.06)", borderRadius: "50%" }} />

        {/* Clickable Avatar */}
        <div
          onClick={() => fileInputRef.current.click()}
          onMouseOver={() => setHoveredAvatar(true)}
          onMouseOut={() => setHoveredAvatar(false)}
          style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: photo ? "transparent" : "linear-gradient(135deg, #E63946, #C1121F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.5rem", margin: "0 auto 0.5rem",
            border: "3px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(230,57,70,0.4)",
            cursor: "pointer", position: "relative", overflow: "hidden",
            transition: "transform 0.2s",
            transform: hoveredAvatar ? "scale(1.05)" : "scale(1)",
          }}
        >
          {photo
            ? <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            : "👤"
          }
          {/* Hover overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
            opacity: hoveredAvatar ? 1 : 0,
            transition: "opacity 0.2s",
            fontSize: "1.5rem",
          }}>📷</div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: "none" }}
        />

        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: "0.3rem 0 0.8rem", cursor: "pointer" }}
          onClick={() => fileInputRef.current.click()}>
          📷 Photo change karo
        </p>

        <h2 style={{
          fontSize: "1.8rem", fontWeight: "900", margin: "0 0 0.4rem",
          background: "linear-gradient(90deg, #F8F9FA, #FF9F1C)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{name || "KHAO User"}</h2>

        <span style={{
          display: "inline-block",
          background: roleStyle.bg, color: roleStyle.color,
          border: `1px solid ${roleStyle.border}`,
          padding: "4px 14px", borderRadius: "20px",
          fontSize: "0.8rem", fontWeight: "800", letterSpacing: "1px",
        }}>{role}</span>
      </div>

      <div style={{ maxWidth: "580px", margin: "-2.5rem auto 0", padding: "0 2rem 3rem", position: "relative", zIndex: 1 }}>

        {/* Edit Profile Card */}
        <div style={{ background: "white", borderRadius: "24px", padding: "2rem", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#1A1A2E", marginTop: 0, fontWeight: "800", fontSize: "1.1rem" }}>✏️ Edit Profile</h3>

          <label style={labelStyle}>👤 Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Apna naam daalo" style={inputStyle("name")}
            onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} />

          <label style={labelStyle}>📧 Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="aapka@email.com" style={inputStyle("email")}
            onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />

          <label style={labelStyle}>📱 Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="10 digit phone number"
            style={{ ...inputStyle("phone"), marginBottom: "1.5rem" }}
            onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} />

          <button onClick={handleSave} style={{
            width: "100%", padding: "0.9rem",
            background: saved ? "#2DC653" : "#E63946",
            color: "white", border: "none", borderRadius: "12px",
            cursor: "pointer", fontWeight: "800", fontSize: "1rem", transition: "background 0.3s",
          }}
            onMouseOver={e => { if (!saved) e.currentTarget.style.background = "#C1121F"; }}
            onMouseOut={e => { if (!saved) e.currentTarget.style.background = "#E63946"; }}
          >{saved ? "✅ Saved!" : "💾 Save Changes"}</button>
        </div>

        {/* Quick Links */}
        <div style={{ background: "white", borderRadius: "24px", padding: "2rem", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#1A1A2E", marginTop: 0, fontWeight: "800", fontSize: "1.1rem" }}>🔗 Quick Links</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {quickLinks.map((link, i) => (
              <div key={i} onClick={() => navigate(link.path)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.9rem 1.2rem",
                  background: hoveredLink === i ? "#FFF0F0" : "#FFF8F0",
                  border: hoveredLink === i ? "1.5px solid #E63946" : "1.5px solid transparent",
                  borderRadius: "12px", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseOver={() => setHoveredLink(i)}
                onMouseOut={() => setHoveredLink(null)}
              >
                <span style={{ fontWeight: "700", color: "#1A1A2E", fontSize: "0.95rem" }}>{link.emoji} {link.label}</span>
                <span style={{ color: hoveredLink === i ? "#E63946" : "#6c757d", fontWeight: "700", transition: "color 0.2s" }}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width: "100%", padding: "0.9rem",
          background: "transparent", color: "#E63946",
          border: "2px solid #E63946", borderRadius: "12px",
          cursor: "pointer", fontWeight: "800", fontSize: "1rem", transition: "all 0.2s",
        }}
          onMouseOver={e => { e.currentTarget.style.background = "#E63946"; e.currentTarget.style.color = "white"; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#E63946"; }}
        >🚪 Logout</button>
      </div>
    </div>
  );
};

export default Profile;
