import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

const statusColors = {
  PLACED: "#FF9F1C",
  CONFIRMED: "#3A86FF",
  PREPARING: "#8338EC",
  OUT_FOR_DELIVERY: "#06D6A0",
  DELIVERED: "#2DC653",
};

const statusEmoji = {
  PLACED: "📋",
  CONFIRMED: "✅",
  PREPARING: "👨‍🍳",
  OUT_FOR_DELIVERY: "🛵",
  DELIVERED: "🎉",
};

const statusBg = {
  PLACED: "rgba(255,159,28,0.12)",
  CONFIRMED: "rgba(58,134,255,0.12)",
  PREPARING: "rgba(131,56,236,0.12)",
  OUT_FOR_DELIVERY: "rgba(6,214,160,0.12)",
  DELIVERED: "rgba(45,198,83,0.12)",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredOrder, setHoveredOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Orders fetch nahi hue!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
        }}>📦 My Orders</span>
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
        }}>📦 Order History</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", margin: 0, fontSize: "0.95rem" }}>
          Aapke saare orders ek jagah
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 2rem 3rem" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: "#6c757d" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
            <div style={{ fontWeight: "700", color: "#1A1A2E", fontSize: "1.1rem", marginBottom: "0.4rem" }}>
              Orders load ho rahe hain...
            </div>
            <div style={{ fontSize: "0.9rem" }}>Thoda rukko yaar 😄</div>
          </div>

        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😔</div>
            <div style={{ fontWeight: "800", color: "#1A1A2E", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              Abhi tak koi order nahi kiya!
            </div>
            <p style={{ color: "#6c757d", fontSize: "0.95rem", marginBottom: "2rem" }}>
              Bhook lagi hai? Abhi order karo!
            </p>
            <button onClick={() => navigate("/restaurants")} style={{
              padding: "0.85rem 2.5rem", background: "#E63946",
              color: "white", border: "none", borderRadius: "12px",
              cursor: "pointer", fontWeight: "800", fontSize: "1rem",
            }}
              onMouseOver={e => e.currentTarget.style.background = "#C1121F"}
              onMouseOut={e => e.currentTarget.style.background = "#E63946"}
            >🍕 Abhi Order Karo</button>
          </div>

        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {orders.map((order) => (
              <div key={order.id}
                style={{
                  background: "white", borderRadius: "20px", overflow: "hidden",
                  border: hoveredOrder === order.id ? "2px solid #E63946" : "2px solid transparent",
                  boxShadow: hoveredOrder === order.id ? "0 16px 40px rgba(230,57,70,0.13)" : "0 4px 20px rgba(0,0,0,0.07)",
                  transition: "all 0.25s",
                }}
                onMouseOver={() => setHoveredOrder(order.id)}
                onMouseOut={() => setHoveredOrder(null)}
              >
                {/* Status color strip */}
                <div style={{ height: "4px", background: statusColors[order.status] || "#ccc" }} />

                <div style={{ padding: "1.5rem" }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div>
                      <p style={{ margin: "0 0 0.2rem", fontWeight: "800", color: "#1A1A2E", fontSize: "1rem" }}>
                        Order #{order.id}
                      </p>
                      <p style={{ margin: 0, color: "#6c757d", fontSize: "0.82rem" }}>
                        🗓️ {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                      </p>
                    </div>
                    <span style={{
                      background: statusBg[order.status] || "rgba(0,0,0,0.06)",
                      color: statusColors[order.status] || "#333",
                      padding: "6px 14px", borderRadius: "20px",
                      fontSize: "0.8rem", fontWeight: "800",
                      border: `1px solid ${statusColors[order.status] || "#ccc"}33`,
                    }}>
                      {statusEmoji[order.status]} {order.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Items */}
                  <div style={{ background: "#FFF8F0", borderRadius: "12px", padding: "0.8rem 1rem", marginBottom: "1rem" }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between",
                        fontSize: "0.88rem", color: "#1A1A2E", padding: "0.3rem 0",
                        borderBottom: i < order.items.length - 1 ? "1px dashed rgba(0,0,0,0.08)" : "none",
                      }}>
                        <span style={{ fontWeight: "600" }}>
                          🍽️ {item.name}
                          <span style={{ color: "#6c757d", fontWeight: "400" }}> ×{item.quantity}</span>
                        </span>
                        <span style={{ fontWeight: "700", color: "#E63946" }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, color: "#6c757d", fontSize: "0.83rem", maxWidth: "55%" }}>
                      📍 {order.deliveryAddress}
                    </p>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 0.3rem", fontWeight: "900", color: "#FF9F1C", fontSize: "1.2rem" }}>
                        ₹{order.totalAmount}
                      </p>
                      {order.status !== "DELIVERED" && (
                        <span
                          onClick={() => navigate("/order-tracking", { state: { orderId: order.id } })}
                          style={{ color: "#E63946", fontSize: "0.85rem", cursor: "pointer", fontWeight: "700", textDecoration: "underline" }}
                        >Track Order →</span>
                      )}
                    </div>
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

export default OrderHistory;