import React from "react";
//antd imports
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

//css file imports
import "./SearchComponent.scss";

const SearchComponent = ({ searchQuery, searchTask, disabled }) => {
  return (
    <div className="search_div">
      <Input
        disabled={disabled}
        value={searchQuery}
        placeholder="Search Tasks By Title or Description"
        onChange={(e) => searchTask(e)}
        suffix={<SearchOutlined style={{ cursor: "pointer" }} />}
        style={{
          width: "50%",
          padding: "8px",
          border: "1px solid rgba(179,179,171, 0.87)",
        }}
      />
    </div>
  );
};
export default SearchComponent;
