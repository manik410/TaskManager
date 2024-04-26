import React from "react";

//css imports
import "./CountInfo.scss";

const CountInfo = ({ label, count, color }) => {
  return (
    <div className="count_box" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="heading_subContent">{count || 0}</div>
      <div className="heading">{label}</div>
    </div>
  );
};
export default CountInfo;
