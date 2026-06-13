import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getOrderById } from "../services/orderService";

const steps = [
  { label: "Order Placed", icon: "📋", desc: "Aapka order place ho gaya!" },
  { label: "Confirmed", icon: "✅", desc: "Restaurant ne order confirm kar liya" },
  { label: "Preparing", icon: "👨‍🍳", desc: "Khana ban raha hai..." },
  { label: "Out for Delivery", icon: "🛵", desc: "Delivery boy aa raha hai!" },
  { label: "Delivered", icon: "🎉", desc: "Order deliver ho gaya!" },
];

const statusIndex = {
  PLACED: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error("Order fetch nahi hua!", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      // Har 10 seconds mein auto refresh
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const currentStep = order ? statusIndex[order.status] ?? 0 : 0;
  const isDelivered = order?.status === "DELIVERED";

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#FFF8F0", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", background: "#0F0F1A",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ color: "#E63946", margin: 0, fontSize: "2rem", cursor: "pointer", fontWeight: "900" }}
          onClick={() => navigate("/restaurants")}>
          🍛 KHAO
        </h1>
        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>📍 Order Tracking</span>
      </nav>

      <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 2rem" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "#555" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
            <p style={{ fontWeight: "700" }}>Order load ho raha hai...</p>
          </div>
        ) : (
          <>
            {/* Order ID Card */}
            <div style={{
              background: isDelivered ? "linear-gradient(135deg, #1b5e20, #2e7d32)" : "linear-gradient(135deg, #0F0F1A, #1A1A2E)",
              borderRadius: "20px", padding: "2rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              marginBottom: "1.5rem", textAlign: "center", color: "white"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                {isDelivered ? "🎉" : "🛵"}
              </div>
              <h2 style={{ margin: "0 0 0.5rem", fontWeight: "900", fontSize: "1.5rem" }}>
                {isDelivered ? "Order Delivered!" : "Order On The Way!"}
              </h2>
              <p style={{ margin: "0 0 1rem", opacity: 0.7, fontSize: "0.9rem" }}>
                Order ID: <strong>#{orderId}</strong>
              </p>
              <div style={{
                display: "inline-block", background: "rgba(255,255,255,0.15)",
                padding: "0.5rem 1.5rem", borderRadius: "20px",
                fontWeight: "800", fontSize: "1.2rem"
              }}>
                ₹{order?.totalAmount || 0}
              </div>

              {/* Auto refresh indicator */}
              {!isDelivered && (
                <p style={{ margin: "1rem 0 0", opacity: 0.5, fontSize: "0.8rem" }}>
                  🔄 Har 10 seconds mein auto update ho raha hai
                </p>
              )}
            </div>

            {/* Tracking Steps */}
            <div style={{
              background: "white", borderRadius: "20px", padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "1.5rem"
            }}>
              <h3 style={{ color: "#1A1A2E", marginTop: 0, fontWeight: "800" }}>📍 Live Tracking</h3>
              <div>
                {steps.map((step, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: "1rem",
                    marginBottom: i < steps.length - 1 ? "1.5rem" : 0,
                    position: "relative"
                  }}>
                    {/* Vertical line */}
                    {i < steps.length - 1 && (
                      <div style={{
                        position: "absolute", left: "23px", top: "48px",
                        width: "2px", height: "calc(100% + 0.5rem)",
                        background: i < currentStep ? "#E63946" : "#e0e0e0"
                      }} />
                    )}

                    {/* Circle */}
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                      background: i < currentStep ? "#E63946" : i === currentStep ? "#FF9F1C" : "#f0f0f0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.4rem",
                      boxShadow: i === currentStep ? "0 0 0 4px rgba(255,159,28,0.25)" : "none",
                      transition: "all 0.3s"
                    }}>
                      {i < currentStep ? "✓" : step.icon}
                    </div>

                    {/* Text */}
                    <div style={{ paddingTop: "8px" }}>
                      <p style={{
                        margin: 0, fontWeight: i <= currentStep ? "800" : "500",
                        color: i <= currentStep ? "#1A1A2E" : "#aaa",
                        fontSize: "1rem"
                      }}>
                        {step.label}
                        {i === currentStep && (
                          <span style={{
                            marginLeft: "8px", background: "#FF9F1C",
                            color: "white", padding: "2px 8px",
                            borderRadius: "10px", fontSize: "0.75rem", fontWeight: "700"
                          }}>CURRENT</span>
                        )}
                      </p>
                      <p style={{
                        margin: "2px 0 0", fontSize: "0.85rem",
                        color: i <= currentStep ? "#6c757d" : "#ccc"
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{
              background: "white", borderRadius: "20px", padding: "1.5rem 2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "1.5rem"
            }}>
              <h3 style={{ color: "#1A1A2E", marginTop: 0, fontWeight: "800" }}>📦 Delivery Info</h3>
              <p style={{ color: "#555", margin: "0 0 0.5rem", fontSize: "0.95rem" }}>
                📍 <strong>Address:</strong> {order?.deliveryAddress || "N/A"}
              </p>
              <p style={{ color: "#555", margin: 0, fontSize: "0.95rem" }}>
                📞 <strong>Phone:</strong> {order?.phone || "N/A"}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => navigate("/orders")} style={{
                flex: 1, padding: "0.9rem", background: "#1A1A2E",
                color: "white", border: "none", borderRadius: "12px",
                cursor: "pointer", fontWeight: "700", fontSize: "1rem"
              }}>
                📦 My Orders
              </button>
              <button onClick={() => navigate("/restaurants")} style={{
                flex: 1, padding: "0.9rem", background: "#E63946",
                color: "white", border: "none", borderRadius: "12px",
                cursor: "pointer", fontWeight: "700", fontSize: "1rem"
              }}>
                🍕 Order More
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;