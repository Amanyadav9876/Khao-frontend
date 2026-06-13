import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // passed from Signup.jsx

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `https://fooddeliveryapp-backend-production-33e8.up.railway.app/api/auth/verify-otp?email=${email}&otp=${otp}`
      );
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // redirect to login after 2s
    } catch (err) {
      const message = err.response?.data?.error;
      if (err.response?.status === 400) {
        setError(message || "Invalid OTP! Please try again.");
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  if (!email) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem" }}>
        <h2>KHAO 🍕 - Verify OTP</h2>
        <p style={{ color: "red" }}>
          No email found. Please{" "}
          <span
            style={{ color: "green", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            signup again.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem" }}>
      <h2>KHAO 🍕 - Verify OTP</h2>
      <p>OTP bheja gaya hai: <strong>{email}</strong></p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "0.5rem", background: "green", color: "white" }}
        >
          Verify OTP
        </button>
      </form>
      <p>
        Wapas jaana hai?{" "}
        <span
          style={{ color: "green", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Signup karo
        </span>
      </p>
    </div>
  );
};

export default VerifyOtp;