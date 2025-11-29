import React from "react";
import "../styles/DashboardPage.css";

const StatCard = ({ label, value, accent }) => {
  return (
    <div className={`stat-card stat-${accent}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
};

export default StatCard;
