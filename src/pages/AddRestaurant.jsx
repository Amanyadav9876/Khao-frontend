import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRestaurant } from "../services/restaurantService";

const CUISINES = ["North Indian", "South Indian", "Chinese", "Italian", "Fast Food", "Mughlai", "Street Food", "Biryani", "Pizza", "Desserts"];

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    rating: "",
    cuisine: "",
    openTime: "",
    closeTime: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.cuisine || !form.openTime || !form.closeTime) {
      setError("Saare fields fill karo!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addRestaurant({
        ...form,
        rating: parseFloat(form.rating) || 4.0,
        timings: `${form.openTime} - ${form.closeTime}`,
      });
      setSuccess(true);
      setTimeout(() => navigate("/restaurants"), 2000);
    } catch (err) {
      setError("Restaurant add nahi hua! Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "0.85rem 1rem",
    border: focusedField === field ? "1.5px solid #E63946" : "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: "10px",
    fontSize: "1rem",
    outline: "none",
    color: "#1A1A2E",
    background: "white",
    boxSizing: "border-box",
    transition: "border 0.2s",
    fontFamily: "'Segoe UI', sans-serif",
  });

  const labelStyle = {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#1A1A2E",
    display: "block",
    marginBottom: "0.4rem",
  };

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
        }}>🏪 Restaurant Add Karo</span>
      </nav>

      {/* Page Header */}
      <div style={{
        background: "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 60%, #2a0a0a 100%)",
        padding: "2.5rem 3rem", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", background: "rgba(230,57,70,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-50px", left: "-30px", width: "160px", height: "160px", background: "rgba(255,159,28,0.06)", borderRadius: "50%" }} />
        <h2 style={{
          fontSize: "2.2rem", fontWeight: "900", margin: "0 0 0.4rem",
          background: "linear-gradient(90deg, #F8F9FA, #FF9F1C)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>🏪 Apna Restaurant Add Karo</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", margin: 0, fontSize: "0.95rem" }}>
          Details bharo aur apna restaurant list mein add karo
        </p>
      </div>

      {/* Form Card */}
      <div style={{ maxWidth: "620px", margin: "2.5rem auto", padding: "0 2rem 3rem" }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>

          {/* Success */}
          {success && (
            <div style={{
              background: "rgba(45,198,83,0.1)", border: "1.5px solid rgba(45,198,83,0.3)",
              color: "#1a7a3a", padding: "1rem", borderRadius: "12px",
              marginBottom: "1.5rem", fontWeight: "700", textAlign: "center", fontSize: "1rem",
            }}>
              🎉 Restaurant successfully add ho gaya! Redirect ho raha hai...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "#FFF0F0", border: "1.5px solid rgba(230,57,70,0.27)",
              color: "#C1121F", padding: "0.75rem 1rem", borderRadius: "10px",
              marginBottom: "1.2rem", fontWeight: "600",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={labelStyle}>🏪 Restaurant Ka Naam</label>
              <input
                name="name"
                placeholder="Jaise: Sharma Ji Ki Rasoi"
                value={form.name}
                onChange={handleChange}
                style={inputStyle("name")}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Address */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={labelStyle}>📍 Address</label>
              <textarea
                name="address"
                placeholder="Jaise: 12, MG Road, Connaught Place, Delhi"
                value={form.address}
                onChange={handleChange}
                rows={2}
                style={{ ...inputStyle("address"), resize: "vertical", lineHeight: "1.5" }}
                onFocus={() => setFocusedField("address")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Cuisine */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={labelStyle}>🍽️ Cuisine Type</label>
              <select
                name="cuisine"
                value={form.cuisine}
                onChange={handleChange}
                style={{ ...inputStyle("cuisine"), cursor: "pointer", appearance: "auto" }}
                onFocus={() => setFocusedField("cuisine")}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">-- Cuisine chuniye --</option>
                {CUISINES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={labelStyle}>⭐ Rating (1.0 - 5.0)</label>
              <input
                name="rating"
                type="number"
                min="1" max="5" step="0.1"
                placeholder="Jaise: 4.2"
                value={form.rating}
                onChange={handleChange}
                style={inputStyle("rating")}
                onFocus={() => setFocusedField("rating")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Timings */}
            <div style={{ marginBottom: "1.8rem" }}>
              <label style={labelStyle}>🕐 Timings</label>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.78rem", color: "#6c757d", marginBottom: "0.3rem", fontWeight: "600" }}>Opening Time</div>
                  <input
                    name="openTime" type="time"
                    value={form.openTime}
                    onChange={handleChange}
                    style={inputStyle("openTime")}
                    onFocus={() => setFocusedField("openTime")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div style={{ color: "#6c757d", fontWeight: "700", marginTop: "1.2rem" }}>→</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.78rem", color: "#6c757d", marginBottom: "0.3rem", fontWeight: "600" }}>Closing Time</div>
                  <input
                    name="closeTime" type="time"
                    value={form.closeTime}
                    onChange={handleChange}
                    style={inputStyle("closeTime")}
                    onFocus={() => setFocusedField("closeTime")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || success} style={{
              width: "100%", padding: "0.95rem",
              background: loading || success ? "#6c757d" : "#E63946",
              color: "white", border: "none", borderRadius: "12px",
              fontSize: "1rem", cursor: loading || success ? "not-allowed" : "pointer",
              fontWeight: "800", letterSpacing: "0.5px", transition: "background 0.2s",
            }}
              onMouseOver={e => { if (!loading && !success) e.currentTarget.style.background = "#C1121F"; }}
              onMouseOut={e => { if (!loading && !success) e.currentTarget.style.background = "#E63946"; }}
            >
              {loading ? "Add ho raha hai..." : success ? "✅ Done!" : "🏪 Restaurant Add Karo"}
            </button>

            {/* Cancel */}
            <button type="button" onClick={() => navigate("/restaurants")} style={{
              width: "100%", padding: "0.85rem",
              background: "transparent", color: "#6c757d",
              border: "1.5px solid rgba(0,0,0,0.12)",
              borderRadius: "12px", fontSize: "0.95rem",
              cursor: "pointer", fontWeight: "700", marginTop: "0.8rem", transition: "all 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.border = "1.5px solid #E63946"; e.currentTarget.style.color = "#E63946"; }}
              onMouseOut={e => { e.currentTarget.style.border = "1.5px solid rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#6c757d"; }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;