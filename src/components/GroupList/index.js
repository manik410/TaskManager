import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd imports
import { Button, Input, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

//helper functions imports
import { addGroupData } from "../../redux/slice/addGroupSlice";
import { API_URL, checkSequenceAndCoverage } from "../../helpers/constants";

//css imports
import "./GroupList.scss";

const GroupList = () => {
  const [loading, setLoading] = useState(false);
  const [status, setShowStatus] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const { groups } = useSelector((state) => state?.groups);
  const dispatch = useDispatch();

  //helper function to reset the groups
  const resetStatus = () => {
    setShowStatus(false);
    setData([]);
  };

  //helper function to change the min and max for a group
  const changeGroupValues = (id, key, value) => {
    resetStatus();
    let dummyGroupData = JSON.parse(JSON.stringify(groups));
    let newData = {
      ...dummyGroupData,
      [id]: { ...dummyGroupData[id], [key]: value },
    };
    dispatch(addGroupData(newData));
    checkErrors(newData);
  };

  //helper function to add the group
  const addGroup = () => {
    resetStatus();
    let lastKey = Number(
      Object.keys(groups || {})[Object.keys(groups || {})?.length - 1]
    );
    let newKey = lastKey ? lastKey + 1 : 1;
    if (Number(groups[lastKey]?.max) >= 10) {
      message.error("You can only group upto at max 10 tasks");
      return;
    }
    dispatch(addGroupData({ ...groups, [newKey]: { min: "", max: "" } }));
  };

  //helper function to delete the group
  const deleteGroup = (id) => {
    resetStatus();
    let dummyGroupData = JSON.parse(JSON.stringify(groups));
    delete dummyGroupData[id];
    dispatch(addGroupData({ ...dummyGroupData }));
  };

  //helper function to show the errors on the UI for input boxes
  const checkErrors = (data) => {
    let errorData = {};
    Object.keys(data || {})?.forEach((item) => {
      let { min, max } = data[item];
      errorData[item] = { min: false, max: false };
      min = Number(min) || 0;
      max = Number(max) || 0;
      if (min === 0 || min >= max)
        errorData[item] = { ...errorData[item], min: true };
      if (max > 10 || max <= min)
        errorData[item] = { ...errorData[item], max: true };
      if (min >= 1 && max <= 10 && min < max)
        errorData[item] = { ...errorData[item], min: false, max: false };
    });
    setErrors(errorData);
  };

  //helper function to show the status of the tasks group wise
  const showStatus = () => {
    const { valid, wrongGroupIndex } = checkSequenceAndCoverage(groups);
    if (valid) {
      setShowStatus(true);
      setLoading(true);
      let apiUrls = [];
      Object.keys(groups || {})?.forEach((item) => {
        let { min, max } = groups[item];
        for (let i = parseInt(min); i <= parseInt(max); i++) {
          apiUrls.push(`${API_URL}${i}`);
        }
      });
      const promises = apiUrls?.map((url) =>
        fetch(url).then((response) => response.json())
      );
      Promise.all(promises)
        .then((data) => setData(data))
        .catch((error) => {
          console.error("Error:", error);
          setShowStatus(false);
        })
        .finally(() => setLoading(false));
    } else {
      message.error(
        `Group ${wrongGroupIndex} is wrong in sequence. No two groups can have overlapping values or same values.Please re-arrange your groups`
      );
    }
  };

  const getTaskStatusUI = ({ min, max }) => {
    let UI = [];
    for (let i = parseInt(min); i <= parseInt(max); i++) {
      UI.push(
        <p key={`status_${i}`} style={{ textTransform: "capitalize" }}>
          {`(${i})-${data?.find((it) => it?.id === i)?.completed}`}&nbsp;
        </p>
      );
    }
    return UI;
  };

  return (
    <div role="main">
      <div className="header">
        <div className="content">Ultimate Task Manager</div>
        <div className="sub_content_div">
          <div className="sub_content">
            Here you can create groups of Tasks and you can view the completion
            status of the Tasks group-wise.
          </div>
        </div>
      </div>
      <br />
      <div className="task_container">
        {Object.keys(groups || {})?.map((item) => {
          return (
            <div className="task_body" key={item}>
              <div className="task_details">
                <DeleteOutlined
                  onClick={() => deleteGroup(item)}
                  role="button"
                  className="icon"
                  style={{ color: "#f75555" }}
                />
                <div className="content">{`Group ${item}`}</div>
                <div className="field_div">
                  <Input
                    style={{ borderColor: errors[item]?.min ? "red" : "" }}
                    placeholder="From"
                    name="min"
                    type="number"
                    value={groups[item]?.min}
                    onChange={(e) =>
                      changeGroupValues(item, "min", e?.target?.value)
                    }
                  />
                </div>
                <div className="field_div_second">
                  <Input
                    style={{ borderColor: errors[item]?.max ? "red" : "" }}
                    placeholder="To"
                    type="number"
                    name="max"
                    value={groups[item]?.max}
                    onChange={(e) =>
                      changeGroupValues(item, "max", e?.target?.value)
                    }
                  />
                </div>
              </div>
              {status && !loading && (
                <div className="status_details">
                  {getTaskStatusUI(groups[item])}
                </div>
              )}
            </div>
          );
        })}
        <Button type="primary" color="#fff" onClick={() => addGroup()}>
          Add Group
        </Button>
      </div>
      <div className="status_button_container">
        <Button type="primary" color="#fff" onClick={() => showStatus()}>
          Show Status
        </Button>
      </div>
    </div>
  );
};
export default GroupList;
