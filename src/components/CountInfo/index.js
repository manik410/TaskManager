import React from "react";

//css imports
import "./CountInfo.scss";

const CountInfo = ({ label, count, color }) => {
  return (
    <section
      className="count_box"
      style={{ borderLeft: `5px solid ${color}` }}
      aria-label={label}
    >
      <div className="heading_subContent" aria-hidden="true">
        {count || 0}
      </div>
      <h2 className="heading">{label}</h2>
    </section>
  );
};
export default CountInfo;
