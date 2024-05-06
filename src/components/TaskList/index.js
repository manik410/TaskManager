import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

//antd imports
import { Button, Col, Popconfirm, Row, Select, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

//custom component imports
import AddTaskComponent from "../AddTask";
import SearchComponent from "../SearchComponent";
import CountInfo from "../CountInfo";
import NoDataFound from "../NoDataFound";
import Filters from "../Filters";

//helper functions imports
import { addTask } from "../../redux/slice/addTaskSlice";
import { Task_Count_Category, Task_Status } from "../../helpers/constants";

//css imports
import "./TaskList.scss";

const TaskList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [sortValue, setSortValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [counts, setCounts] = useState({
    to_do: 0,
    in_progress: 0,
    completed: 0,
  });
  const [status, setStatus] = useState("add");
  const [taskId, setTaskId] = useState("");
  const [data, setdata] = useState([]);
  const { tasks } = useSelector((state) => state?.tasks);
  const { mobile } = useSelector((state) => state?.config);
  const dispatch = useDispatch();

  useEffect(() => {
    let todoCount = 0;
    let progressCount = 0;
    let completedCount = 0;
    tasks?.forEach((task) => {
      if (task?.status === "To Do") {
        todoCount += 1;
      } else if (task?.status === "In Progress") {
        progressCount += 1;
      } else {
        completedCount += 1;
      }
    });
    setCounts({
      completed: completedCount,
      to_do: todoCount,
      in_progress: progressCount,
      total_count: tasks?.length,
    });
    setdata(tasks);
  }, [tasks]);

  //function for resetting the add and edit modal for the task details
  const resetModal = (val) => {
    setStatus("add");
    setTaskId("");
    setModalOpen(val);
  };

  //function for viewing the task
  const viewTask = (id) => {
    setTaskId(id);
    setStatus("edit");
    setModalOpen(true);
  };

  //function for deleting the task
  const deleteTask = (id) =>
    dispatch(addTask(tasks?.filter((task) => task?.task_id !== id)));

  //function for changing the status of the task
  const changeStatus = (id, val) => {
    let currentTaskIndex = tasks?.findIndex((task) => task?.task_id === id);
    let dummyTasks = [...tasks];
    let currentTask = dummyTasks[currentTaskIndex];
    currentTask = { ...currentTask, status: val };
    dummyTasks[currentTaskIndex] = currentTask;
    dispatch(addTask(dummyTasks));
  };

  //function for searching the task
  const searchTask = (e) => {
    setSearchQuery(e?.target?.value);
    filterData(e?.target?.value, sortValue, appliedFilters);
  };

  //function for handling the change in the filter values
  const changeFilters = (type, val) => {
    let filters = {};
    if (type === "start_date" || type === "end_date") {
      filters = {
        ...appliedFilters,
        date:
          type === "start_date"
            ? val
              ? [val]
              : []
            : val
            ? [appliedFilters?.date?.[0], val]
            : [appliedFilters?.date?.[0]],
      };
    } else filters = { ...appliedFilters, [type]: val };
    setAppliedFilters(filters);
  };

  //function for applying the filters
  const applyFilters = () => {
    setFilterPopoverOpen(false);
    filterData(searchQuery, sortValue, appliedFilters);
  };

  //function for resetting the filters
  const clearFilters = () => {
    setAppliedFilters({});
    setFilterPopoverOpen(false);
    filterData(searchQuery, sortValue, {});
  };

  //function for returning the filter count
  const returnFiltersCount = (appliedFilters) => {
    let count = 0;
    Object.keys(appliedFilters || {})?.forEach((item) => {
      if (appliedFilters[item]?.length) count = count + 1;
    });
    return count;
  };

  //helper function for filtering the data on the basis of searching,sorting and filtering
  const filterData = (searchQuery, sortValue, appliedFilters) => {
    if (
      !searchQuery?.trim()?.length &&
      !sortValue?.trim()?.length &&
      !returnFiltersCount(appliedFilters)
    ) {
      setdata(tasks);
    } else {
      let filteredData = tasks;
      filteredData = tasks?.filter(
        (task) =>
          task?.title
            ?.toLowerCase()
            .includes(searchQuery?.toLowerCase()?.trim()) ||
          task?.description
            ?.toLowerCase()
            .includes(searchQuery?.toLowerCase()?.trim())
      );
      switch (sortValue) {
        case "priority":
          filteredData.sort((a, b) => {
            const priorityOrder = { Low: 1, Medium: 2, High: 3 };
            return priorityOrder[b?.priority] - priorityOrder[a?.priority];
          });
          break;
        case "due_date":
          filteredData.sort(
            (a, b) => new Date(b?.due_date) - new Date(a?.due_date)
          );
          break;
        case "status":
          filteredData.sort((a, b) => {
            const statusOrder = { "To Do": 1, "In Progress": 2, Completed: 3 };
            return statusOrder[b?.status] - statusOrder[a?.status];
          });
          break;
        default:
          break;
      }
      if (returnFiltersCount(appliedFilters)) {
        filteredData = filteredData?.filter((task) => {
          if (appliedFilters?.priority && appliedFilters?.priority?.length) {
            if (!appliedFilters?.priority?.includes(task?.priority))
              return false;
          }
          if (appliedFilters?.status && appliedFilters?.status?.length) {
            if (!appliedFilters?.status?.includes(task?.status)) return false;
          }
          if (appliedFilters?.date && appliedFilters?.date?.length === 2) {
            const taskDueDate = new Date(task?.due_date).getTime();
            const startTimestamp = new Date(
              appliedFilters?.date?.[0]
            ).getTime();
            const endTimestamp = new Date(appliedFilters?.date?.[1]).getTime();
            if (
              !(taskDueDate >= startTimestamp && taskDueDate <= endTimestamp)
            ) {
              return false;
            }
          }
          return true;
        });
      }
      setdata(filteredData);
    }
  };

  //helper function for returing the task actions on the UI.
  const taskActions = (task) => {
    return (
      <div className="task_actions">
        <Select
          aria-label="Status of Task"
          size={mobile ? "small" : ""}
          placeholder="Change Status"
          style={{ width: mobile ? "70%" : "75%" }}
          options={Task_Status}
          value={task?.status}
          onChange={(e) => changeStatus(task?.task_id, e)}
        />
        <EditOutlined
          role="button"
          className="icon"
          onClick={() => viewTask(task?.task_id)}
          style={{ color: "#1e7cff" }}
        />
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => deleteTask(task?.task_id)}
          placement="left"
          okText="Confirm"
          cancelText="Cancel"
        >
          <DeleteOutlined
            role="button"
            className="icon"
            style={{ color: "#f75555" }}
          />
        </Popconfirm>
      </div>
    );
  };

  const calculateDays = (date) => {
    let noOfDays = moment(date).diff(new Date(), "days");
    if (noOfDays <= 7) {
      return { colour: "red", value: `${noOfDays} days` };
    } else if (noOfDays > 7 && noOfDays <= 31) {
      return { colour: "amber", value: `${Math.floor(noOfDays / 7)} weeks` };
    } else {
      return { colour: "green", value: `${Math.floor(noOfDays / 30)} months` };
    }
  };
  const generateTask = (title) => {
    if (searchQuery) {
      let highlightedTitle = [];
      let firstIndex = title.indexOf(searchQuery);
      let lastIndex = firstIndex + searchQuery.length;

      for (let i = 0; i < title.length; i++) {
        if (i >= firstIndex && i < lastIndex) {
          highlightedTitle.push(
            <span key={i} style={{ background: "red", color: "#fff" }}>
              {title[i]}
            </span>
          );
        } else {
          highlightedTitle.push(title[i]);
        }
      }

      return <div className="title">{highlightedTitle}</div>;
    } else {
      return <div className="title">{title}</div>;
    }
  };

  return (
    <div role="main">
      <div className="header">
        <div className="content">Ultimate Task Manager</div>
        <div className="sub_content_div">
          <div className="sub_content">
            You can manage daily tasks by adding, editing, or deleting them.
            Tasks can be assigned priorities and status. You can also search and
            filter tasks based on priority, due date, and completion status.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: mobile ? "center" : "",
            }}
          >
            <Button
              className="add_button"
              type="primary"
              color="#fff"
              size={mobile ? "small" : "large"}
              onClick={() => setModalOpen(true)}
            >
              <PlusOutlined />
              Add a New Task
            </Button>
          </div>
        </div>
      </div>
      <div className="summary_data">
        {mobile ? (
          <Row>
            {Task_Count_Category?.map((info) => {
              return (
                <Col span={12}>
                  <CountInfo
                    color={info?.color}
                    label={info?.label}
                    key={info?.label}
                    count={counts?.[info?.value]}
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          Task_Count_Category?.map((info) => {
            return (
              <CountInfo
                color={info?.color}
                label={info?.label}
                key={info?.label}
                count={counts?.[info?.value]}
              />
            );
          })
        )}
      </div>
      <div className="task_container">
        <div className="task_actions_header">
          <SearchComponent
            searchQuery={searchQuery}
            disabled={!tasks?.length}
            searchTask={searchTask}
          />
          <Filters
            searchQuery={searchQuery}
            filterPopoverOpen={filterPopoverOpen}
            setFilterPopoverOpen={setFilterPopoverOpen}
            appliedFilters={appliedFilters}
            sortPopoverOpen={sortPopoverOpen}
            setSortPopoverOpen={setSortPopoverOpen}
            setSortValue={setSortValue}
            filterData={filterData}
            changeFilters={changeFilters}
            returnFiltersCount={returnFiltersCount}
            disabled={!tasks?.length}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
          />
        </div>
        {data?.length > 0 ? (
          <div>
            {data?.map((task) => {
              return (
                <div className="task_body" key={task?.task_id}>
                  <div className="task_details">
                    <div className="content">
                      <div className="title_div">
                        {generateTask(task?.title)}
                        <Tag
                          color={
                            task?.priority === "Low"
                              ? "yellow"
                              : task?.priority === "High"
                              ? "red"
                              : "green"
                          }
                          className="tags"
                        >
                          {`${task?.priority} Priority`}
                        </Tag>
                        <Tag
                          style={{
                            color: calculateDays(task?.due_date)?.colour,
                          }}
                        >{`Due in ${
                          calculateDays(task?.due_date)?.value
                        }`}</Tag>
                      </div>
                      {mobile && taskActions(task)}
                    </div>
                    <div className="content_des">{task?.description}</div>
                  </div>
                  {!mobile && taskActions(task)}
                </div>
              );
            })}
          </div>
        ) : (
          <NoDataFound />
        )}
      </div>
      <AddTaskComponent
        modalOpen={modalOpen}
        setModalOpen={(val) => resetModal(val)}
        status={status}
        taskId={taskId}
      />
    </div>
  );
};
export default TaskList;
