import React from "react";
import "./../styles/InfoCard.css";

function InfoCard({ title, subtitle, highlight }) {
  return (
    <div className="info-card">
      <p className="info-card-title">{title}</p>
      {subtitle && <p className="info-card-subtitle">{subtitle}</p>}
      {highlight && <p className="info-card-highlight">{highlight}</p>}
    </div>
  );
}

export default InfoCard;
