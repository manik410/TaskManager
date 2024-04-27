import React from "react";
import { useSelector } from "react-redux";

//images imports
import NoDataFoundImg from "../../assets/no_data_found.svg";
import NoDataFoundMobileImg from "../../assets/no_data_found_mobile.svg";

//css imports
import "./NoDataFound.scss";

const NoDataFound = () => {
  const { mobile } = useSelector((state) => state?.config);
  return (
    <div className="no_content">
      <img
        src={mobile ? NoDataFoundMobileImg : NoDataFoundImg}
        alt="no data found"
        height={"300px"}
        width={"300px"}
      />
      <p className="content">No Tasks Added Yet</p>
    </div>
  );
};
export default NoDataFound;
