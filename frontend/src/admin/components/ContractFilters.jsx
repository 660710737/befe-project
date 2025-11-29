import React from "react";
import "../styles/ContractsComponents.css";

const ContractFilters = ({
  searchText,
  setSearchText,
  buildingFilter,
  setBuildingFilter,
  statusFilter,
  setStatusFilter,
}) => {
  const handleSubmit = (e) => e.preventDefault();

  return (
    <form className="contract-filters" onSubmit={handleSubmit}>
      <input
        type="text"
        className="contract-input"
        placeholder="ค้นหาไอดี/ชื่อผู้จอง"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <select
        className="contract-select"
        value={buildingFilter}
        onChange={(e) => setBuildingFilter(e.target.value)}
      >
        <option value="ทั้งหมด">อาคารทั้งหมด</option>
        <option value="A">อาคาร A</option>
        <option value="B">อาคาร B</option>
      </select>

      <select
        className="contract-select"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="ทั้งหมด">สถานะ: ทั้งหมด</option>
        <option value="waiting">รอทำสัญญา</option>
        <option value="today">วันนี้</option>
        <option value="done">เสร็จสิ้น</option>
      </select>

    </form>
  );
};

export default ContractFilters;
