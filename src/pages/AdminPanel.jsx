import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers, getAllRestaurantsAdmin,
  getAllOrdersAdmin, blockUser, blockRestaurant
} from "../services/adminService";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("stats");
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [u, r, o] = await Promise.all([
        getAllUsers(), getAllRestaurantsAdmin(), getAllOrdersAdmin()
      ]);
      setUsers(u);
      setRestaurants(r);
      setOrders(o);
    } catch (err) {
      console.error("Data fetch nahi hua!", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId);
      fetchAll();
    } catch (err) {
      alert("User block nahi hua!");
    }
  };

  const handleBlockRestaurant = async (restaurantId) => {
    try {
      await blockRestaurant(restaurantId);
      fetchAll();
    } catch (err) {
      alert("Restaurant block nahi hua!");
    }
  };

  const tabStyle = (active) => ({
    padding: "0.6rem 1.5rem", border: "none", borderRadius: "8px",
    cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem",
    background: active ? "#2e7d32" : "#f0f0f0",
    color: active ? "white" : "#555"
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", background: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100
      }}>
        <h1 style={{ color: "#2e7d32", margin: 0, fontSize: "2rem" }}>🍕 KHAO</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ color: "#555", fontWeight: "bold" }}>Admin Panel</span>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} style={{
            padding: "0.5rem 1.2rem", background: "#c62828", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 2rem" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button style={tabStyle(tab === "stats")} onClick={() => setTab("stats")}>📊 Stats</button>
          <button style={tabStyle(tab === "users")} onClick={() => setTab("users")}>👥 Users</button>
          <button style={tabStyle(tab === "restaurants")} onClick={() => setTab("restaurants")}>🏪 Restaurants</button>
          <button style={tabStyle(tab === "orders")} onClick={() => setTab("orders")}>📦 Orders</button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#555" }}>Data load ho raha hai...</p>
        ) : (
          <>
            {/* ===== STATS TAB ===== */}
            {tab === "stats" && (
              <div>
                <h3 style={{ color: "#1b5e20" }}>📊 App Overview</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
                  {[
                    { icon: "👥", label: "Total Users", value: users.length, color: "#1565c0" },
                    { icon: "🏪", label: "Total Restaurants", value: restaurants.length, color: "#2e7d32" },
                    { icon: "📦", label: "Total Orders", value: orders.length, color: "#6a1b9a" },
                    { icon: "💰", label: "Total Revenue", value: `₹${totalRevenue}`, color: "#ff6f00" },
                  ].map((stat, i) => (
                    <div key={i} style={{
                      background: "white", borderRadius: "16px", padding: "1.5rem",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)", textAlign: "center"
                    }}>
                      <div style={{ fontSize: "2.5rem" }}>{stat.icon}</div>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: stat.color, margin: "0.5rem 0" }}>
                        {stat.value}
                      </div>
                      <div style={{ color: "#777", fontSize: "0.9rem" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== USERS TAB ===== */}
            {tab === "users" && (
              <div>
                <h3 style={{ color: "#1b5e20" }}>👥 All Users</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {users.map((user) => (
                    <div key={user.id} style={{
                      background: "white", borderRadius: "12px", padding: "1rem 1.5rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{user.name}</p>
                        <p style={{ margin: "0.2rem 0 0", color: "#777", fontSize: "0.9rem" }}>
                          📧 {user.email} | 🏷️ {user.role}
                        </p>
                      </div>
                      <button onClick={() => handleBlockUser(user.id)} style={{
                        padding: "0.4rem 1rem",
                        background: user.blocked ? "#2e7d32" : "#c62828",
                        color: "white", border: "none", borderRadius: "8px",
                        cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem"
                      }}>
                        {user.blocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== RESTAURANTS TAB ===== */}
            {tab === "restaurants" && (
              <div>
                <h3 style={{ color: "#1b5e20" }}>🏪 All Restaurants</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {restaurants.map((r) => (
                    <div key={r.id} style={{
                      background: "white", borderRadius: "12px", padding: "1rem 1.5rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{r.name}</p>
                        <p style={{ margin: "0.2rem 0 0", color: "#777", fontSize: "0.9rem" }}>
                          📍 {r.address} | 📞 {r.phone}
                        </p>
                      </div>
                      <button onClick={() => handleBlockRestaurant(r.id)} style={{
                        padding: "0.4rem 1rem",
                        background: r.blocked ? "#2e7d32" : "#c62828",
                        color: "white", border: "none", borderRadius: "8px",
                        cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem"
                      }}>
                        {r.blocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {tab === "orders" && (
              <div>
                <h3 style={{ color: "#1b5e20" }}>📦 All Orders</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {orders.map((order) => (
                    <div key={order.id} style={{
                      background: "white", borderRadius: "12px", padding: "1.2rem 1.5rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <strong>Order #{order.id}</strong>
                        <span style={{
                          background: "#2e7d32", color: "white",
                          padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.85rem"
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#777", fontSize: "0.9rem" }}>
                        👤 User: {order.userName || order.userId} |
                        🏪 Restaurant: {order.restaurantName || order.restaurantId}
                      </p>
                      <p style={{ margin: "0.3rem 0 0", color: "#ff6f00", fontWeight: "bold" }}>
                        💰 ₹{order.totalAmount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;