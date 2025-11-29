import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import BookingTable from "../components/BookingTable"; // ใช้ตัวเดียวกับหน้า BookingPage
import "../styles/DashboardPage.css";

const DashboardPage = () => {
  // 1. สร้าง State สำหรับเก็บข้อมูล
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    newBookingsMonth: 0,
    availableRooms: 0,
    allBookings: 0,
    contractsToday: 0
  });

  // 2. ดึงข้อมูล Dashboard Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/dashboard-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  // 3. ดึงข้อมูล Booking ล่าสุด (และจัดการชื่อให้เหมือนหน้า BookingPage)
  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/bookings");
        if (res.ok) {
          const data = await res.json();
          
          // แปลงข้อมูลให้ตารางแสดงผลได้ (รวมชื่อคนที่ 1 + 2)
          const normalized = data.map((b) => {
            let displayName = b.guest1Name || `User ${b.userId}`;
            if (b.people === 2 && b.guest2Name) {
              displayName = `${b.guest1Name}, ${b.guest2Name}`;
            }
            return {
              id: b.id,
              name: displayName, // ชื่อที่รวมมาแล้ว
              building: b.building,
              people: b.people,
              checkinDate: b.moveInDate, // ส่งไปตรงๆ เดี๋ยว Table แปลงวันที่เอง หรือจะแปลงที่นี่ก็ได้
              status: mapStatus(b.status),
            };
          });

          // ตัดเอาแค่ 5 รายการล่าสุด
          setRecentBookings(normalized.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchRecentBookings();
  }, []);

  // Helper แปลงสถานะ (ถ้าจำเป็น)
  const mapStatus = (status) => {
    if (status === "รอตรวจสอบ") return "pending";
    if (status === "อนุมัติแล้ว") return "approved";
    if (status === "ปฏิเสธ") return "rejected";
    return status;
  };

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>

        <section className="stat-grid">
          <StatCard 
            label="การจองใหม่ (รอบเดือน)" 
            value={stats.newBookingsMonth} 
            accent="yellow" 
          />
          <StatCard 
            label="ห้องว่างทั้งหมด" 
            value={stats.availableRooms} 
            accent="cyan" 
          />
          <StatCard 
            label="การจองทั้งหมด" 
            value={stats.allBookings} 
            accent="magenta" 
          />
          <StatCard 
            label="สัญญาที่ต้องทำวันนี้" 
            value={stats.contractsToday} 
            accent="green" 
          />
        </section>

        {/* หัวข้อและปุ่มดูทั้งหมด */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h3 style={{ fontSize: "18px", margin: 0 }}>การจองล่าสุด</h3>
          <a href="/admin/bookings" style={{ color: "#00aaff", textDecoration: "none", fontSize: "14px" }}>
            ดูทั้งหมด
          </a>
        </div>

        {/* ส่ง recentBookings ไปให้ตาราง 
            สังเกตว่าเราไม่ส่ง onApprove/onReject เพราะหน้า Dashbaord เอาไว้ดูอย่างเดียว 
        */}
        <BookingTable bookings={recentBookings} /> 
      </div>
    </div>
  );
};

export default DashboardPage;