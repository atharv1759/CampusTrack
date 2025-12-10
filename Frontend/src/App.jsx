import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Loader from "./components/common/Loader/Loader";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import "./App.css";
import LostItemsPage from "./components/admin-dashboard/Lost-Item/LostItemPage";
import ReportLostItem from "./pages/ReportLostItem";
import UserDashboard from "./pages/UserDashboard";
import ReportFoundItem from "./pages/ReportFoundItem";
import ContactPage from "./pages/ContactPage";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/lost-items" element={<LostItemsPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<ContactPage />} />


        {/* Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute tokenKey="token">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-lost-item"
          element={
            <ProtectedRoute tokenKey="token">
              <ReportLostItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-found-item"
          element={
            <ProtectedRoute tokenKey="token">
              <ReportFoundItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/*"
          element={
            <ProtectedRoute tokenKey="token">
              <UserDashboard />
            </ProtectedRoute>
          }
        />


        {/* Redirect unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
