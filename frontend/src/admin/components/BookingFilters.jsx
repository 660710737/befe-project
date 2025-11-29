import React from "react";
import "../styles/BookingComponents.css";

const BookingFilters = ({
  searchText,       // 👈 เปลี่ยนจาก searchName เป็น searchText
  setSearchText,    // 👈 เปลี่ยนจาก setSearchName เป็น setSearchText
  buildingFilter,
  setBuildingFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="booking-filters">
      <input
        type="text"
        className="booking-input"
        placeholder="ค้นหาชื่อผู้จอง"
        value={searchText}       // 👈 ใช้ searchText
        onChange={(e) => setSearchText(e.target.value)} // 👈 ใช้ setSearchText
      />

      <select
        className="booking-select"
        value={buildingFilter}
        onChange={(e) => setBuildingFilter(e.target.value)}
      >
        <option value="ทั้งหมด">อาคารทั้งหมด</option>
        <option value="A">อาคาร A</option>
        <option value="B">อาคาร B</option>
      </select>

      <select
        className="booking-select"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="ทั้งหมด">สถานะทั้งหมด</option>
        <option value="pending">รอตรวจสอบ</option>
        <option value="approved">อนุมัติแล้ว</option>
        <option value="rejected">ปฏิเสธ</option>
      </select>
    </div>
  );
};

export default BookingFilters;