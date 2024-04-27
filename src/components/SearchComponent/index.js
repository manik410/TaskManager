import React from "react";
import { useSelector } from "react-redux";

//antd imports
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

//css file imports
import "./SearchComponent.scss";

const SearchComponent = ({ searchQuery, searchTask, disabled }) => {
  const { mobile } = useSelector((state) => state?.config);
  return (
    <div className="search_div" role="search">
      <Input
        disabled={disabled}
        value={searchQuery}
        placeholder="Search Tasks By Title or Description"
        onChange={(e) => searchTask(e)}
        suffix={<SearchOutlined style={{ cursor: "pointer" }} />}
        style={{
          width: mobile ? "100%" : "50%",
          padding: mobile ? "4px" : "8px",
          border: "1px solid rgba(179,179,171, 0.87)",
        }}
        aria-label="Search Tasks"
      />
    </div>
  );
};
export default SearchComponent;
