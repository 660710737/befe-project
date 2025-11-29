import React from "react";
import "../styles/BookingComponents.css";

const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "รอตรวจสอบ";
    case "approved":
      return "อนุมัติแล้ว";
    case "rejected":
      return "ปฏิเสธ";
    default:
      return status;
  }
};

const BookingTable = ({ bookings, onDetail, onApprove, onReject }) => {
  return (
    <div className="booking-table-wrapper">
      <table className="booking-table">
        <thead>
          <tr>
            <th>id</th>
            <th>ชื่อผู้จอง</th>
            <th>อาคาร</th>
            <th>จำนวนคน</th>
            <th>วันที่เข้าพัก</th>
            <th>สถานะ</th>
            <th className="booking-actions-header">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                ไม่พบรายการจอง
              </td>
            </tr>
          )}

          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.name}</td>
              <td>{b.building}</td>
              <td>{b.people}</td>
              <td>{b.checkinDate}</td>
              <td>
                <span className={`status-badge ${b.status}`}>
                  {getStatusLabel(b.status)}
                </span>
              </td>
              <td className="booking-actions-cell">
                <button
                  className="btn-table default"
                  onClick={() => onDetail(b)}
                >
                  รายละเอียด
                </button>
                <button
                  className="btn-table success"
                  disabled={b.status !== "pending"}
                  onClick={() => onApprove(b)}
                >
                  อนุมัติ
                </button>
                <button
                  className="btn-table danger"
                  disabled={b.status === "rejected"}
                  onClick={() => onReject(b)}
                >
                  ปฏิเสธ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
