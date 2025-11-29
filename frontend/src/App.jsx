import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

/* USER */
import Navbar from "./user/components/Navbar";
import HomePage from "./user/pages/HomePage";
import LoginPage from "./user/pages/LoginPage";
import RegisterPage from "./user/pages/RegisterPage";
import RoomsPage from "./user/pages/RoomsPage";
import ProfilePage from "./user/pages/ProfilePage";

/* ADMIN */
import AdminLoginPage from "./admin/pages/LoginPage";
import DashboardPage from "./admin/pages/DashboardPage";
import BookingPage from "./admin/pages/BookingPage";
import MembersPage from "./admin/pages/MembersPage";
import ContractsPage from "./admin/pages/ContractsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  /* USER AUTH */
  const handleUserLogin = () => setIsLoggedIn(true);
  const handleUserLogout = () => {
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  /* ADMIN AUTH */
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem("adminAuth", "true"); // 👑 จำว่า login เป็น admin
    window.location.href = "/admin/dashboard";
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("adminAuth"); // ❌ ลบสถานะ admin ตอนออก
    window.location.href = "/admin";
  };

  /* ✅ อ่านค่า login admin ตอนเปิดเว็บ (เพื่อไม่ให้หลุดตอนรีเฟรช) */
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAdminLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">

      {/* ซ่อน Navbar ถ้าอยู่ admin */}
      {!window.location.pathname.startsWith("/admin") && (
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleUserLogout} />
      )}

      <Routes>

        {/* ------------------ USER ROUTES ------------------ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleUserLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* ------------------ ADMIN ROUTES ------------------ */}
        <Route path="/admin" element={<AdminLoginPage onLogin={handleAdminLogin} />} />
        <Route path="/admin/dashboard" element={isAdminLoggedIn ? <DashboardPage onLogout={handleAdminLogout} /> : <AdminLoginPage onLogin={handleAdminLogin} />} />
        <Route path="/admin/bookings" element={isAdminLoggedIn ? <BookingPage /> : <AdminLoginPage onLogin={handleAdminLogin} />} />
        <Route path="/admin/contracts" element={isAdminLoggedIn ? <ContractsPage /> : <AdminLoginPage onLogin={handleAdminLogin} />} />
        <Route path="/admin/members" element={isAdminLoggedIn ? <MembersPage /> : <AdminLoginPage onLogin={handleAdminLogin} />} />
      </Routes>

    </div>
  );
}

export default App;
