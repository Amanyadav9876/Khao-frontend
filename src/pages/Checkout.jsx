import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { placeOrder } from "../services/orderService";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Map click handler — reverse geocoding
const LocationPicker = ({ setPosition, setAddress, setMapAddress }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );
        const data = await response.json();
        const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setAddress(addr);
        setMapAddress(addr);
      } catch (err) {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    },
  });
  return null;
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, totalAmount } = location.state || { cart: [], totalAmount: 0 };

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [position, setPosition] = useState([28.6139, 77.2090]);
  const [mapAddress, setMapAddress] = useState("");

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Aapka browser geolocation support nahi karta!");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
          );
          const data = await response.json();
          const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setAddress(addr);
          setMapAddress(addr);
        } catch (err) {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        alert("Location access do — browser settings mein allow karo!");
        setLocLoading(false);
      }
    );
  };

  const handlePayment = async () => {
    if (!address || !phone) {
      alert("Address aur phone number daalo!");
      return;
    }

    const options = {
      key: "rzp_test_SygMqfFmDxx1GG",
      amount: totalAmount * 100,
      currency: "INR",
      name: "KHAO 🍛",
      description: "Food Order Payment",
      handler: async (response) => {
        try {
          setLoading(true);
          const orderData = {
            items: cart.map((item) => ({
              menuItemId: item.id,
              quantity: item.qty,
              price: item.price,
            })),
            totalAmount,
            deliveryAddress: address,
            phone,
            paymentId: response.razorpay_payment_id,
            userId: localStorage.getItem("userId"),
            restaurentId: localStorage.getItem("restaurantId"),
            latitude: position[0],
            longitude: position[1],
          };
          const order = await placeOrder(orderData);
          navigate("/order-tracking", { state: { orderId: order.id } });
        } catch (err) {
          alert("Order place nahi hua! Try again.");
        } finally {
          setLoading(false);
        }
      },
      prefill: { contact: phone },
      theme: { color: "#E63946" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const inputStyle = {
    display: "block", width: "100%", marginTop: "0.5rem",
    marginBottom: "1.2rem", padding: "0.85rem 1rem",
    borderRadius: "10px", border: "1.5px solid #e0e0e0",
    fontSize: "1rem", outline: "none", boxSizing: "border-box",
    fontFamily: "'Segoe UI', sans-serif", transition: "border 0.2s",
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#FFF8F0", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", background: "#0F0F1A",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ color: "#E63946", margin: 0, fontSize: "2rem", cursor: "pointer", fontWeight: "900", letterSpacing: "2px" }}
          onClick={() => navigate("/restaurants")}>
          🍛 KHAO
        </h1>
        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>🛒 Checkout</span>
      </nav>

      {/* Progress Bar */}
      <div style={{ background: "white", padding: "1rem 3rem", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", maxWidth: "800px", margin: "0 auto" }}>
          {["Cart", "Delivery Details", "Payment"].map((step, i) => (
            <React.Fragment key={i}>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                color: i <= 1 ? "#E63946" : "#aaa", fontWeight: i <= 1 ? "700" : "400",
                fontSize: "0.9rem"
              }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: i <= 1 ? "#E63946" : "#e0e0e0",
                  color: "white", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "0.75rem", fontWeight: "800"
                }}>{i + 1}</div>
                {step}
              </div>
              {i < 2 && <div style={{ flex: 1, height: "2px", background: i < 1 ? "#E63946" : "#e0e0e0" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", padding: "2rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>

        {/* Delivery Details */}
        <div style={{ flex: 2 }}>
          <h2 style={{ color: "#1A1A2E", fontWeight: "800", marginBottom: "1.5rem" }}>📍 Delivery Details</h2>
          <div style={{ background: "white", borderRadius: "20px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>

            {/* Map */}
            <label style={{ fontWeight: "700", color: "#333", fontSize: "0.9rem" }}>
              🗺️ Map pe delivery location select karo
            </label>
            <p style={{ color: "#6c757d", fontSize: "0.8rem", margin: "0.3rem 0 0.8rem" }}>
              Map pe click karo ya neeche button se current location use karo!
            </p>
            <div style={{
              height: "280px", borderRadius: "14px", overflow: "hidden",
              marginBottom: "1.2rem", border: "1.5px solid #e0e0e0"
            }}>
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
                <LocationPicker
                  setPosition={setPosition}
                  setAddress={setAddress}
                  setMapAddress={setMapAddress}
                />
              </MapContainer>
            </div>

            {/* Selected location */}
            {mapAddress && (
              <div style={{
                background: "#e8f5e9", border: "1.5px solid #a5d6a7",
                borderRadius: "8px", padding: "0.6rem 1rem",
                marginBottom: "1rem", fontSize: "0.85rem", color: "#1b5e20", fontWeight: "600"
              }}>
                📍 Selected: {mapAddress}
              </div>
            )}

            {/* Current Location Button */}
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={locLoading}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.7rem 1.4rem",
                background: locLoading ? "#aaa" : "#1A1A2E",
                color: "white", border: "none", borderRadius: "10px",
                cursor: locLoading ? "not-allowed" : "pointer",
                fontWeight: "700", fontSize: "0.9rem",
                marginBottom: "1.2rem", transition: "background 0.2s",
              }}
              onMouseOver={e => { if (!locLoading) e.currentTarget.style.background = "#E63946"; }}
              onMouseOut={e => { if (!locLoading) e.currentTarget.style.background = "#1A1A2E"; }}
            >
              {locLoading ? "⏳ Location fetch ho rahi hai..." : "📍 Current Location Use Karo"}
            </button>

            <label style={{ fontWeight: "700", color: "#333", fontSize: "0.9rem" }}>
              Delivery Address (edit kar sakte ho)
            </label>
            <textarea
              placeholder="Ghar ka poora address daalo — gali, mohalla, city..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={e => e.target.style.border = "1.5px solid #E63946"}
              onBlur={e => e.target.style.border = "1.5px solid #e0e0e0"}
            />

            <label style={{ fontWeight: "700", color: "#333", fontSize: "0.9rem" }}>Phone Number</label>
            <input
              type="tel"
              placeholder="10 digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.border = "1.5px solid #E63946"}
              onBlur={e => e.target.style.border = "1.5px solid #e0e0e0"}
            />

            <div style={{
              background: "#FFF0F0", border: "1.5px solid rgba(230,57,70,0.2)",
              borderRadius: "10px", padding: "0.8rem 1rem",
              display: "flex", gap: "1rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>⚡</span>
              <div>
                <p style={{ margin: 0, fontWeight: "700", color: "#1A1A2E", fontSize: "0.9rem" }}>
                  Estimated Delivery: 30 minutes
                </p>
                <p style={{ margin: 0, color: "#6c757d", fontSize: "0.8rem" }}>
                  Free delivery on this order!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#1A1A2E", fontWeight: "800", marginBottom: "1.5rem" }}>🧾 Order Summary</h2>
          <div style={{
            background: "white", borderRadius: "20px", padding: "1.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            position: "sticky", top: "80px"
          }}>
            <div style={{ marginBottom: "1rem" }}>
              {cart.map((item) => (
                <div key={item.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "0.7rem", background: "#FFF8F0",
                  borderRadius: "8px", padding: "0.5rem 0.8rem", fontSize: "0.9rem"
                }}>
                  <span style={{ color: "#1A1A2E", fontWeight: "600" }}>
                    {item.name}
                    <span style={{ color: "#6c757d", fontWeight: "400" }}> ×{item.qty}</span>
                  </span>
                  <span style={{ fontWeight: "800", color: "#E63946" }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1.5px dashed #f0f0f0", paddingTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                <span style={{ color: "#777" }}>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                <span style={{ color: "#777" }}>Delivery charge</span>
                <span style={{ color: "#2e7d32", fontWeight: "700" }}>FREE 🎉</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                <span style={{ color: "#777" }}>GST (5%)</span>
                <span>₹{Math.round(totalAmount * 0.05)}</span>
              </div>
            </div>

            <div style={{
              borderTop: "2px solid #f0f0f0", paddingTop: "1rem", marginTop: "0.5rem",
              display: "flex", justifyContent: "space-between",
              fontWeight: "900", fontSize: "1.2rem"
            }}>
              <span style={{ color: "#1A1A2E" }}>Total</span>
              <span style={{ color: "#FF9F1C" }}>₹{totalAmount + Math.round(totalAmount * 0.05)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              style={{
                width: "100%", padding: "1rem",
                background: loading ? "#aaa" : "#E63946",
                color: "white", border: "none", borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "800", fontSize: "1rem", marginTop: "1.5rem",
                transition: "background 0.2s",
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = "#C1121F"; }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = "#E63946"; }}
            >
              {loading ? "Processing..." : `💳 Pay ₹${totalAmount + Math.round(totalAmount * 0.05)}`}
            </button>

            <p style={{ textAlign: "center", color: "#aaa", fontSize: "0.8rem", marginTop: "0.8rem" }}>
              🔒 Secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;