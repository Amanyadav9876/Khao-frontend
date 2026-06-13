import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();
  setError(""); // clear previous error
  try {
    await signupUser({ name, email, password, role });
    navigate("/verify-otp", { state: { email } }); // go to OTP page after signup
  } catch (err) {
    const status = err.response?.status || err.status;
    const message = err.response?.data?.error || err.message;

    if (status === 409) {
      setError("Email already registered! Please login.");
    } else if (status === 400) {
      setError(message || "Invalid details. Please check and try again.");
    } else {
      setError("Server error. Please try again later.");
    }
  }
};
  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem" }}>
      <h2>KHAO 🍕 - Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        >
          <option value="USER">User</option>
          <option value="OWNER">Restaurant Owner</option>
        </select>
        <button type="submit" style={{ width: "100%", padding: "0.5rem", background: "green", color: "white" }}>
          Signup
        </button>
      </form>
      <p>Already account hai? <span style={{ color: "green", cursor: "pointer" }} onClick={() => navigate("/login")}>Login karo</span></p>
    </div>
  );
};

export default Signup;