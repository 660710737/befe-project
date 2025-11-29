import React from "react";
import "../styles/MembersComponents.css";

const MemberTable = ({ members, onDelete }) => {
  return (
    <div className="member-table-wrapper">
      <table className="member-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อ-นามสกุล</th>
            <th>ชื่อผู้ใช้</th>
            <th>อีเมล</th>
            <th>เบอร์โทร</th>
            <th className="member-actions-header">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                ไม่พบสมาชิก
              </td>
            </tr>
          )}

          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.fullname}</td>
              <td>{m.username}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td className="member-actions-cell">
                <button
                  className="member-delete-btn"
                  onClick={() => onDelete(m.id)}
                >
                  ลบ
                </button>


              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
