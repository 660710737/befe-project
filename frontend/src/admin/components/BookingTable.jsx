import React from "react";
import "../styles/DashboardPage.css";

// ฟังก์ชันแปลงสถานะเป็นภาษาไทย
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

// ฟังก์ชันแปลงวันที่เป็น วัน-เดือน-ปี (dd-mm-yyyy)
const formatDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d)) return isoString;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`; // เช่น 30-11-2025
};

const BookingTable = ({ bookings, onDetail, onApprove, onReject }) => {
  return (
    <div className="booking-table-wrapper">
      <table className="booking-table">
        <thead>
          <tr>
            <th>ชื่อ-นามสกุล</th>
            <th>อาคาร</th>
            <th>จำนวน(คน)</th>
            <th>วันที่เข้าพัก</th>
            <th>สถานะ</th>
            {/* ถ้ามี props onApprove ส่งมา แสดงว่าอยู่ในหน้าจัดการ (มีปุ่ม) */}
            {onApprove && <th>จัดการ</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                ไม่พบข้อมูล
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id}>
                {/* ใช้ b.name ที่รวมชื่อมาแล้วจากหน้า BookingPage */}
                <td>{b.name}</td>
                <td>{b.building}</td>
                <td>{b.people}</td>
                {/* ✅ แปลงวันที่เข้าพักเป็น วัน-เดือน-ปี */}
                <td>{formatDate(b.checkinDate || b.moveInDate)}</td>
                <td>
                  <span className={`status-badge ${b.status}`}>
                    {getStatusLabel(b.status)}
                  </span>
                </td>

                {/* แสดงปุ่มจัดการ เฉพาะเมื่ออยู่ในหน้า BookingPage */}
                {onApprove && (
                  <td className="booking-actions-cell">
                    <button
                      className="btn-table default"
                      onClick={() => onDetail(b)}
                    >
                      รายละเอียด
                    </button>
                    {b.status === "pending" && (
                      <>
                        <button
                          className="btn-table success"
                          onClick={() => onApprove(b)}
                        >
                          อนุมัติ
                        </button>
                        <button
                          className="btn-table danger"
                          onClick={() => onReject(b)}
                        >
                          ปฏิเสธ
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
