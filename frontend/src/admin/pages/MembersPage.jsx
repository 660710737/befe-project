import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import MemberFilters from "../components/MemberFilters";
import MemberTable from "../components/MemberTable";
import "../styles/MembersPage.css";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ดึงข้อมูลจาก backend: /api/admin/users (เอามาจาก table users)
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("http://localhost:8080/api/admin/users");
        const data = await res.json().catch(() => []);

        if (!res.ok) {
          throw new Error(data.error || "ไม่สามารถโหลดข้อมูลสมาชิกได้");
        }

        // map field จาก backend (fullName) → frontend (fullname)
        const normalized = (data || []).map((u) => ({
          id: u.id,
          fullname: u.fullName || "",
          username: u.username || "",
          email: u.email || "",
          phone: u.phone || "",
        }));

        setMembers(normalized);
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // ลบสมาชิกออกจากตาราง (เฉพาะฝั่ง UI)
    const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "ต้องการลบสมาชิกคนนี้ออกจากระบบถาวรหรือไม่?"
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:8080/api/admin/users?id=${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Delete failed:", res.status, data);
      alert(data.error || "ลบสมาชิกไม่สำเร็จ");
      return;
    }

    // ลบออกจาก state บนหน้า UI
    setMembers((prev) => prev.filter((m) => m.id !== id));
  } catch (err) {
    console.error("Delete error:", err);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
  }
};




  // filter ตามข้อความค้นหาเหมือนของเดิม
  const filteredMembers = useMemo(() => {
    if (!searchText.trim()) return members;
    const q = searchText.toLowerCase();

    return members.filter((m) => {
      const idStr = String(m.id);
      return (
        idStr.includes(q) ||
        (m.fullname && m.fullname.toLowerCase().includes(q)) ||
        (m.username && m.username.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q))
      );
    });
  }, [members, searchText]);

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="dashboard-main admin-members-page">
        <h1 className="members-page-title">สมาชิกทั้งหมด</h1>

        <MemberFilters searchText={searchText} setSearchText={setSearchText} />

        {loading && <p className="members-info">กำลังโหลดข้อมูลสมาชิก...</p>}
        {error && <p className="members-error">{error}</p>}

        {!loading && !error && (
          <MemberTable members={filteredMembers} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default MembersPage;
