import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyRestaurants, createRestaurant,
  getRestaurantOrders, updateOrderStatus, addMenuItem
} from "../services/ownerService";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rName, setRName] = useState("");
  const [rAddress, setRAddress] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rCity, setRCity] = useState("");
  const [rCuisine, setRCuisine] = useState("Indian");
  const [mName, setMName] = useState("");
  const [mPrice, setMPrice] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mCategory, setMCategory] = useState("Main Course");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async () => {
    try {
      const data = await getMyRestaurants();
      setRestaurants(data);
      if (data.length > 0) setSelectedRestaurant(data[0]);
    } catch (err) {
      console.error("Restaurants fetch nahi hue!", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (restaurantId) => {
    try {
      const data = await getRestaurantOrders(restaurantId);
      setOrders(data);
    } catch (err) {
      console.error("Orders fetch nahi hue!", err);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCreateRestaurant = async () => {
    if (!rName || !rAddress || !rPhone || !rCity) {
      alert("Saari details daalo!");
      return;
    }
    try {
      await createRestaurant({
        name: rName,
        address: rAddress,
        phone: rPhone,
        city: rCity,
        cuisineType: rCuisine,
        open: true
      });
      setRName(""); setRAddress(""); setRPhone(""); setRCity(""); setRCuisine("Indian");
      showSuccess("Restaurant create ho gaya! ✅");
      fetchRestaurants();
    } catch (err) {
      alert("Restaurant create nahi hua!");
    }
  };

  const handleAddMenuItem = async () => {
    if (!mName || !mPrice || !selectedRestaurant) { alert("Item name aur price daalo!"); return; }
    try {
      await addMenuItem({
        name: mName, price: parseFloat(mPrice),
        description: mDesc, category: mCategory,
        restaurantId: selectedRestaurant.id,
        isAvailable: true
      });
      setMName(""); setMPrice(""); setMDesc("");
      showSuccess("Menu item add ho gaya! ✅");
    } catch (err) { alert("Menu item add nahi hua!"); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders(selectedRestaurant.id);
    } catch (err) { alert("Status update nahi hua!"); }
  };

  const statusColors = {
    PLACED: "#ff6f00", CONFIRMED: "#1565c0",
    PREPARING: "#6a1b9a", OUT_FOR_DELIVERY: "#2e7d32", DELIVERED: "#1b5e20"
  };

  const inputStyle = {
    display: "block", width: "95%", marginTop: "0.5rem",
    marginBottom: "1rem", padding: "0.8rem 1rem",
    borderRadius: "10px", border: "1.5px solid #e0e0e0",
    fontSize: "1rem", outline: "none", fontFamily: "'Segoe UI', sans-serif",
    transition: "border 0.2s", boxSizing: "border-box",
  };

  const tabStyle = (active) => ({
    padding: "0.6rem 1.5rem", border: "none", borderRadius: "10px",
    cursor: "pointer", fontWeight: "700", fontSize: "0.95rem",
    background: active ? "#E63946" : "#f0f0f0",
    color: active ? "white" : "#555",
    transition: "all 0.2s",
  });

  const cardStyle = {
    background: "white", borderRadius: "16px", padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "2rem"
  };

  const labelStyle = { fontWeight: "700", color: "#333", fontSize: "0.9rem" };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#FFF8F0", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", background: "#0F0F1A",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ color: "#E63946", margin: 0, fontSize: "2rem", fontWeight: "900", letterSpacing: "2px" }}>
          🍛 KHAO
        </h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>👨‍🍳 Owner Dashboard</span>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} style={{
            padding: "0.5rem 1.2rem", background: "#E63946", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700"
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "950px", margin: "2rem auto", padding: "0 2rem" }}>

        {/* Success Message */}
        {successMsg && (
          <div style={{
            background: "#e8f5e9", border: "1.5px solid #a5d6a7",
            color: "#1b5e20", padding: "0.8rem 1.2rem", borderRadius: "10px",
            marginBottom: "1.5rem", fontWeight: "600", fontSize: "0.95rem"
          }}>
            ✅ {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button style={tabStyle(tab === "restaurants")} onClick={() => setTab("restaurants")}>🏪 Restaurants</button>
          <button style={tabStyle(tab === "menu")} onClick={() => setTab("menu")}>🍽️ Menu Items</button>
          <button style={tabStyle(tab === "orders")} onClick={() => { setTab("orders"); if (selectedRestaurant) fetchOrders(selectedRestaurant.id); }}>📦 Orders</button>
        </div>

        {/* ===== RESTAURANTS TAB ===== */}
        {tab === "restaurants" && (
          <div>
            <div style={cardStyle}>
              <h3 style={{ color: "#1A1A2E", marginTop: 0, fontWeight: "800" }}>➕ Nayi Restaurant Add Karo</h3>

              <label style={labelStyle}>Restaurant Name</label>
              <input value={rName} onChange={(e) => setRName(e.target.value)}
                placeholder="Jaise: Sharma Ji Ka Dhaba" style={inputStyle} />

              <label style={labelStyle}>Address</label>
              <input value={rAddress} onChange={(e) => setRAddress(e.target.value)}
                placeholder="Restaurant ka poora address" style={inputStyle} />

              <label style={labelStyle}>City</label>
              <input value={rCity} onChange={(e) => setRCity(e.target.value)}
                placeholder="Jaise: Delhi, Mumbai, Bangalore" style={inputStyle} />

              <label style={labelStyle}>Phone</label>
              <input value={rPhone} onChange={(e) => setRPhone(e.target.value)}
                placeholder="Contact number" style={inputStyle} />

              <label style={labelStyle}>Cuisine Type</label>
              <select value={rCuisine} onChange={(e) => setRCuisine(e.target.value)}
                style={{ ...inputStyle, width: "98%" }}>
                {["Indian", "Chinese", "Italian", "Fast Food", "South Indian", "Continental", "Mughlai", "Street Food"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button onClick={handleCreateRestaurant} style={{
                padding: "0.8rem 2rem", background: "#E63946", color: "white",
                border: "none", borderRadius: "10px", cursor: "pointer",
                fontWeight: "700", fontSize: "1rem", marginTop: "0.5rem"
              }}>🏪 Create Restaurant</button>
            </div>

            <h3 style={{ color: "#1A1A2E", fontWeight: "800" }}>Mere Restaurants ({restaurants.length})</h3>
            {loading ? (
              <p style={{ color: "#555" }}>Load ho raha hai...</p>
            ) : restaurants.length === 0 ? (
              <p style={{ color: "#aaa" }}>Abhi koi restaurant nahi hai!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {restaurants.map((r) => (
                  <div key={r.id} style={{
                    background: "white", borderRadius: "14px", padding: "1.2rem 1.5rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    border: selectedRestaurant?.id === r.id ? "2px solid #E63946" : "2px solid transparent",
                  }}>
                    <div>
                      <h4 style={{ margin: 0, color: "#1A1A2E", fontWeight: "800" }}>{r.name}</h4>
                      <p style={{ margin: "0.3rem 0 0", color: "#777", fontSize: "0.9rem" }}>
                        📍 {r.address}, {r.city} | 📞 {r.phone}
                      </p>
                      <p style={{ margin: "0.2rem 0 0", color: "#E63946", fontSize: "0.85rem", fontWeight: "600" }}>
                        🍽️ {r.cuisineType}
                      </p>
                    </div>
                    <button onClick={() => { setSelectedRestaurant(r); setTab("menu"); }} style={{
                      padding: "0.5rem 1.2rem", background: "#FFF0F0", color: "#E63946",
                      border: "2px solid #E63946", borderRadius: "8px",
                      cursor: "pointer", fontWeight: "700"
                    }}>Menu →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MENU TAB ===== */}
        {tab === "menu" && (
          <div>
            {restaurants.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Restaurant Select Karo</label>
                <select
                  value={selectedRestaurant?.id || ""}
                  onChange={(e) => setSelectedRestaurant(restaurants.find(r => r.id === e.target.value))}
                  style={{ ...inputStyle, width: "100%" }}
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} — {r.city}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={cardStyle}>
              <h3 style={{ color: "#1A1A2E", marginTop: 0, fontWeight: "800" }}>➕ Menu Item Add Karo</h3>
              {selectedRestaurant && (
                <div style={{
                  background: "#FFF0F0", border: "1.5px solid rgba(230,57,70,0.2)",
                  borderRadius: "8px", padding: "0.6rem 1rem",
                  marginBottom: "1.2rem", fontSize: "0.9rem", color: "#E63946", fontWeight: "600"
                }}>
                  🏪 {selectedRestaurant.name} ke liye add ho raha hai
                </div>
              )}

              <label style={labelStyle}>Item Name</label>
              <input value={mName} onChange={(e) => setMName(e.target.value)}
                placeholder="Jaise: Butter Chicken" style={inputStyle} />

              <label style={labelStyle}>Price (₹)</label>
              <input type="number" value={mPrice} onChange={(e) => setMPrice(e.target.value)}
                placeholder="Jaise: 280" style={inputStyle} />

              <label style={labelStyle}>Category</label>
              <select value={mCategory} onChange={(e) => setMCategory(e.target.value)}
                style={{ ...inputStyle, width: "98%" }}>
                {["Starter", "Main Course", "Dessert", "Beverage", "Snacks", "Biryani", "Pizza", "Burger"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label style={labelStyle}>Description</label>
              <input value={mDesc} onChange={(e) => setMDesc(e.target.value)}
                placeholder="Item ki short description" style={inputStyle} />

              <button onClick={handleAddMenuItem} style={{
                padding: "0.8rem 2rem", background: "#E63946", color: "white",
                border: "none", borderRadius: "10px", cursor: "pointer",
                fontWeight: "700", fontSize: "1rem", marginTop: "0.5rem"
              }}>🍽️ Add Menu Item</button>
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {tab === "orders" && (
          <div>
            <h3 style={{ color: "#1A1A2E", fontWeight: "800" }}>📦 Incoming Orders</h3>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                <div style={{ fontSize: "3rem" }}>📭</div>
                <p style={{ fontWeight: "600" }}>Abhi koi order nahi hai!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.map((order) => (
                  <div key={order.id} style={{
                    background: "white", borderRadius: "14px", padding: "1.5rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                      <strong style={{ color: "#1A1A2E" }}>Order #{order.id}</strong>
                      <span style={{
                        background: statusColors[order.status] || "#ccc",
                        color: "white", padding: "0.2rem 0.8rem",
                        borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700"
                      }}>{order.status}</span>
                    </div>
                    <p style={{ color: "#777", margin: "0 0 0.5rem", fontSize: "0.9rem" }}>
                      📍 {order.deliveryAddress} | 💰 ₹{order.totalAmount}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                      {["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].map((s) => (
                        <button key={s} onClick={() => handleStatusUpdate(order.id, s)} style={{
                          padding: "0.4rem 0.8rem", background: statusColors[s],
                          color: "white", border: "none", borderRadius: "6px",
                          cursor: "pointer", fontSize: "0.8rem", fontWeight: "700"
                        }}>{s.replace(/_/g, " ")}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;