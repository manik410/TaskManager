import React from "react";

//images imports
import NoDataFoundImg from "../../assets/no_data_found.svg";

//css imports
import "./NoDataFound.scss";

const NoDataFound = () => {
  return (
    <div className="no_content">
      <img
        src={NoDataFoundImg}
        alt="no data found"
        height={"300px"}
        width={"300px"}
      />
      <p className="content">No Tasks Added Yet</p>
    </div>
  );
};
export default NoDataFound;
