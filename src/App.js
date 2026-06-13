import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestaurantList from "./pages/RestaurantList";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminPanel from "./pages/AdminPanel";
import VerifyOtp from "./pages/VerifyOtp";
import AddRestaurant from "./pages/AddRestaurant";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Protected Routes */}
          <Route path="/restaurants" element={<ProtectedRoute><RestaurantList /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/add-restaurant" element={<ProtectedRoute><AddRestaurant /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;