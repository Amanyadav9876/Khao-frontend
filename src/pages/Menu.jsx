import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuByRestaurant } from "../services/menuService";

const FOOD_EMOJIS = ["🍕", "🍔", "🍜", "🍱", "🌮", "🍛", "🥗", "🍣", "🍗", "🥙", "🍝", "🥘"];

const Menu = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("restaurantId", id);
    const fetchMenu = async () => {
      try {
        const data = await getMenuByRestaurant(id);
        setMenuItems(data);
      } catch (err) {
        console.error("Menu fetch nahi hua!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing.qty === 1) {
      setCart(cart.filter((c) => c.id !== item.id));
    } else {
      setCart(cart.map((c) => c.id === item.id ? { ...c, qty: c.qty - 1 } : c));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

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
        <div style={{
          background: totalItems > 0 ? "#E63946" : "rgba(255,255,255,0.08)",
          border: totalItems > 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
          color: "#F8F9FA", fontWeight: "700", fontSize: "0.95rem",
          padding: "8px 18px", borderRadius: "20px",
          transition: "background 0.3s", cursor: totalItems > 0 ? "pointer" : "default",
        }}
          onClick={() => totalItems > 0 && navigate("/checkout", { state: { cart, totalAmount } })}
        >
          🛒 {totalItems > 0 ? `${totalItems} items — ₹${totalAmount}` : "Cart khaali hai"}
        </div>
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
        }}>🍽️ Menu</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", margin: 0, fontSize: "0.95rem" }}>
          Apna favourite item chuniye aur order karo
        </p>
      </div>

      <div style={{ display: "flex", gap: "2rem", padding: "2rem 3rem", alignItems: "flex-start" }}>

        {/* Menu Items */}
        <div style={{ flex: 2 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem", color: "#6c757d" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
              <div style={{ fontWeight: "700", color: "#1A1A2E", fontSize: "1.1rem", marginBottom: "0.4rem" }}>Menu load ho raha hai...</div>
              <div style={{ fontSize: "0.9rem" }}>Thoda rukko yaar 😄</div>
            </div>
          ) : menuItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem", color: "#6c757d" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😔</div>
              <div style={{ fontWeight: "700", color: "#1A1A2E", fontSize: "1.1rem" }}>Koi menu item nahi mili!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {menuItems.map((item, idx) => {
                const cartItem = cart.find((c) => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "white", borderRadius: "18px", padding: "1.2rem 1.5rem",
                      border: hoveredItem === item.id ? "2px solid #E63946" : "2px solid transparent",
                      boxShadow: hoveredItem === item.id ? "0 12px 32px rgba(230,57,70,0.13)" : "0 4px 16px rgba(0,0,0,0.06)",
                      transition: "all 0.25s",
                    }}
                    onMouseOver={() => setHoveredItem(item.id)}
                    onMouseOut={() => setHoveredItem(null)}
                  >
                    {/* Left: emoji + info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{
                        width: "56px", height: "56px", borderRadius: "14px",
                        background: "linear-gradient(135deg, #1A1A2E, #2a0a0a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.8rem", flexShrink: 0,
                      }}>
                        {FOOD_EMOJIS[idx % FOOD_EMOJIS.length]}
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 0.25rem", color: "#1A1A2E", fontWeight: "800", fontSize: "1rem" }}>{item.name}</h4>
                        <p style={{ margin: "0 0 0.3rem", color: "#6c757d", fontSize: "0.85rem" }}>{item.description}</p>
                        <p style={{ margin: 0, fontWeight: "900", color: "#FF9F1C", fontSize: "1rem" }}>₹{item.price}</p>
                      </div>
                    </div>

                    {/* Right: cart controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                      {cartItem ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <button onClick={() => removeFromCart(item)} style={{
                            width: "34px", height: "34px", borderRadius: "50%",
                            border: "2px solid #E63946", background: "white",
                            color: "#E63946", fontSize: "1.2rem", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "800", transition: "all 0.2s",
                          }}
                            onMouseOver={e => { e.currentTarget.style.background = "#E63946"; e.currentTarget.style.color = "white"; }}
                            onMouseOut={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#E63946"; }}
                          >−</button>
                          <span style={{ fontWeight: "900", minWidth: "24px", textAlign: "center", fontSize: "1rem", color: "#1A1A2E" }}>{cartItem.qty}</span>
                          <button onClick={() => addToCart(item)} style={{
                            width: "34px", height: "34px", borderRadius: "50%",
                            border: "none", background: "#E63946",
                            color: "white", fontSize: "1.2rem", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "800", transition: "background 0.2s",
                          }}
                            onMouseOver={e => e.currentTarget.style.background = "#C1121F"}
                            onMouseOut={e => e.currentTarget.style.background = "#E63946"}
                          >+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} style={{
                          padding: "0.5rem 1.3rem", background: "#E63946",
                          color: "white", border: "none", borderRadius: "10px",
                          cursor: "pointer", fontWeight: "800", fontSize: "0.9rem",
                          transition: "background 0.2s",
                        }}
                          onMouseOver={e => e.currentTarget.style.background = "#C1121F"}
                          onMouseOut={e => e.currentTarget.style.background = "#E63946"}
                        >+ ADD</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div style={{
          flex: 1, background: "white", borderRadius: "20px",
          padding: "1.5rem", boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
          height: "fit-content", position: "sticky", top: "85px",
          border: "2px solid rgba(0,0,0,0.04)",
        }}>
          <h3 style={{ color: "#1A1A2E", marginTop: 0, fontWeight: "800", fontSize: "1.1rem" }}>🛒 Your Cart</h3>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "#6c757d" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🛒</div>
              <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>Cart khaali hai!</div>
              <div style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}>Kuch add karo 😋</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
                {cart.map((item) => (
                  <div key={item.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#FFF8F0", borderRadius: "10px",
                    padding: "0.6rem 0.8rem", fontSize: "0.88rem",
                  }}>
                    <span style={{ fontWeight: "700", color: "#1A1A2E" }}>
                      {item.name}
                      <span style={{ color: "#6c757d", fontWeight: "400" }}> ×{item.qty}</span>
                    </span>
                    <span style={{ fontWeight: "800", color: "#E63946" }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1.5px dashed rgba(0,0,0,0.08)", paddingTop: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "900", fontSize: "1.1rem" }}>
                  <span style={{ color: "#1A1A2E" }}>Total</span>
                  <span style={{ color: "#FF9F1C" }}>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout", { state: { cart, totalAmount } })}
                style={{
                  width: "100%", padding: "0.9rem", background: "#E63946",
                  color: "white", border: "none", borderRadius: "12px",
                  cursor: "pointer", fontWeight: "800", fontSize: "1rem",
                  transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#C1121F"}
                onMouseOut={e => e.currentTarget.style.background = "#E63946"}
              >
                Checkout 🚀
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
