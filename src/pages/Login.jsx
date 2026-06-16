import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginUser({ email, password });

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("email", email);
      if (response.name) localStorage.setItem("name", response.name);
      if (response.userId) localStorage.setItem("userId", response.userId);

      login(response.token, response.role); // AuthContext update

      if (response.role === "ADMIN") navigate("/admin");
      else if (response.role === "OWNER") navigate("/owner");
      else navigate("/restaurants");
    } catch (err) {
      setError("Invalid email ya password! Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    display: "block", width: "100%",
    padding: "0.85rem 1rem", marginBottom: "1rem",
    border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "10px",
    fontSize: "1rem", outline: "none",
    color: "#1A1A2E", background: "white",
    boxSizing: "border-box", transition: "border 0.2s",
    fontFamily: "'Segoe UI', sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 60%, #2a0a0a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", background: "rgba(230,57,70,0.08)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-100px", left: "-60px", width: "280px", height: "280px", background: "rgba(255,159,28,0.06)", borderRadius: "50%" }} />

      <div style={{
        background: "white", borderRadius: "24px", padding: "2.5rem",
        width: "100%", maxWidth: "420px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        position: "relative", zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 onClick={() => navigate("/")} style={{
            color: "#E63946", margin: "0 0 0.3rem",
            fontSize: "2.5rem", fontWeight: "900",
            letterSpacing: "3px", cursor: "pointer",
          }}>🍛 KHAO</h1>
          <p style={{ color: "#6c757d", fontSize: "0.95rem", margin: 0 }}>
            Wapas aaye! Login karo aur order karo 🍔
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FFF0F0", border: "1.5px solid rgba(230,57,70,0.27)",
            color: "#C1121F", padding: "0.75rem 1rem", borderRadius: "10px",
            marginBottom: "1.2rem", fontWeight: "600",
            display: "flex", alignItems: "center", gap: "8px",
          }}>⚠️ {error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1A1A2E", display: "block", marginBottom: "0.4rem" }}>
            Email Address
          </label>
          <input
            type="email" placeholder="aapka@email.com"
            value={email} required
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.border = "1.5px solid #E63946"}
            onBlur={e => e.target.style.border = "1.5px solid rgba(0,0,0,0.12)"}
          />

          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1A1A2E", display: "block", marginBottom: "0.4rem" }}>
            Password
          </label>
          <div style={{ position: "relative", marginBottom: "0.5rem" }}>
            <input
              type={showPass ? "text" : "password"} placeholder="••••••••"
              value={password} required
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, marginBottom: 0, paddingRight: "3rem" }}
              onFocus={e => e.target.style.border = "1.5px solid #E63946"}
              onBlur={e => e.target.style.border = "1.5px solid rgba(0,0,0,0.12)"}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{
              position: "absolute", right: "12px", top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none",
              cursor: "pointer", fontSize: "1rem", color: "#6c757d",
            }}>{showPass ? "🙈" : "👁️"}</button>
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <span style={{ color: "#E63946", fontSize: "0.85rem", cursor: "pointer", fontWeight: "600" }}>
              Password bhool gaye?
            </span>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.9rem",
            background: loading ? "#6c757d" : "#E63946",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "800", letterSpacing: "0.5px", transition: "background 0.2s",
          }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.background = "#C1121F"; }}
            onMouseOut={e => { if (!loading) e.currentTarget.style.background = "#E63946"; }}
          >
            {loading ? "Login ho raha hai..." : "Login Karo 🚀"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
          <span style={{ color: "#6c757d", fontSize: "0.85rem" }}>ya</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
        </div>

        <p style={{ textAlign: "center", margin: 0, color: "#6c757d", fontSize: "0.95rem" }}>
          Account nahi hai?{" "}
          <span onClick={() => navigate("/signup")} style={{ color: "#E63946", cursor: "pointer", fontWeight: "800" }}>
            Sign Up karo →
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
