import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";

const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "รอตรวจสอบ";
    case "approved":
      return "อนุมัติแล้ว";
    case "rejected":
      return "ปฏิเสธ";
    case "contract_signed":
      return "ทำสัญญาแล้ว";
    default:
      return status || "-";
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d)) return isoString;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`; // ตัวอย่าง: 30-11-2025
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res1 = await fetch("http://localhost:8080/api/profile", {
          credentials: "include",
        });
        setProfile(await res1.json());

        const res2 = await fetch("http://localhost:8080/api/bookings", {
          credentials: "include",
        });

        if (res2.ok) {
          const data = await res2.json();
          setBookings(Array.isArray(data) ? data : []);
        } else {
          setBookings([]);
        }
      } catch (e) {
        console.log(e);
        setBookings([]);
      }
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="profile-wrapper">กำลังโหลด...</div>;

  return (
    <main className="profile-wrapper">
      {/* 🔶 การ์ดโปรไฟล์ */}
      <section className="profile-card">
        <h2 className="profile-name">{profile.fullName}</h2>
        <p className="profile-phone">{profile.phone}</p>
        <p className="profile-email">{profile.email}</p>
      </section>

      {/* 🔷 ส่วนประวัติการจอง */}
      <section className="history-section">
        <h2 className="history-title">ประวัติการจอง</h2>

        {/* ❗ ไม่มีประวัติการจอง */}
        {bookings.length === 0 && (
          <div className="history-card">
            <p style={{ fontSize: "18px", color: "#555" }}>
              ยังไม่มีประวัติการจอง
            </p>
          </div>
        )}

        {/* 🟢 มีประวัติการจอง */}
        {bookings.length > 0 &&
          bookings.map((b) => (
            <div key={b.id} className="history-card">
              {/* Header */}
              <div className="history-header">
                <span>จองเมื่อ: {formatDate(b.createdAt)}</span>
              </div>

              {/* ตาราง */}
              <table className="history-table">
                <thead>
                  <tr>
                    <th>อาคาร</th>
                    <th>จำนวนผู้เข้า</th>
                    <th>วันที่เข้าพัก</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{b.building}</td>
                    <td>{b.people} คน</td>
                    <td>{formatDate(b.moveInDate)}</td>
                  </tr>
                </tbody>
              </table>

              {/* รายละเอียด */}
              <div className="history-status">
                <p>
                  สถานะ:{" "}
                  <span className="status-orange">
                    {getStatusLabel(b.status)}
                  </span>
                </p>
                <p>วันที่ทำสัญญา: รอแจ้ง (ภายใน 24 ชม.)</p>
                <p>เลขห้อง: แจ้งในวันทำสัญญา</p>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}

export default ProfilePage;
