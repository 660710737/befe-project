import React from "react";
import "../styles/ContractsComponents.css";

const statusLabel = {
  waiting: "รอทำสัญญา",
  today: "วันนี้",
  done: "เสร็จสิ้น",
};

const ContractTable = ({ contracts, onOpenModal }) => {
  return (
    <div className="contract-table-wrapper">
      <table className="contract-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อ-นามสกุล</th>
            <th>อาคาร</th>
            <th>วันที่เข้าพัก</th>
            <th>วันที่สัญญา</th>
            <th>สถานะ</th>
            <th>ห้อง</th>
            <th className="contract-actions-header">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                ไม่พบรายการ
              </td>
            </tr>
          )}

          {contracts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.building}</td>
              <td>{c.checkinDate}</td>
              <td>{c.contractDate}</td>
              <td>
                <span className={`contract-status-badge ${c.status}`}>
                  {statusLabel[c.status]}
                </span>
              </td>
              <td>{c.room || "-"}</td>
              <td className="contract-actions-cell">
                <button
                  className="btn-contract-do"
                  onClick={() => onOpenModal(c)}
                >
                  ทำสัญญา
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractTable;
