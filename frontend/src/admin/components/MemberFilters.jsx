import React from "react";
import "../styles/MembersComponents.css";

const MemberFilters = ({ searchText, setSearchText }) => {
  return (
    <div className="member-filters">
      <input
        type="text"
        className="member-search-input"
        placeholder="ค้นหา ID, ชื่อ, อีเมล, เบอร์โทร"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default MemberFilters;
