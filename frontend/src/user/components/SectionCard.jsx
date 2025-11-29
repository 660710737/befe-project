import React from "react";
import "./../styles/InfoCard.css";

function SectionCard({ title, children }) {
  return (
    <section className="section-card">
      <h3 className="section-card-title">{title}</h3>
      <div className="section-card-content">{children}</div>
    </section>
  );
}

export default SectionCard;
