import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd imports
import { Button, Col, Input, Popconfirm, Radio, Row, Select, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

//custom component imports
import AddTaskComponent from "../AddTask";

//css imports
import "./TaskList.scss";
import { addTask } from "../../redux/slice/addTaskSlice";
import { Task_Status } from "../../helpers/constants";

const TaskList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [counts, setCounts] = useState({
    to_do: 0,
    in_progress: 0,
    completed: 0,
  });
  const [status, setStatus] = useState("add");
  const [taskId, setTaskId] = useState("");
  const [data, setdata] = useState([]);
  const { tasks } = useSelector((state) => state?.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    let todoCount = 0;
    let progressCount = 0;
    let completedCount = 0;
    tasks?.forEach((task) => {
      if (task?.status === "To Do") todoCount += 1;
      else if (task?.status === "In Progress") progressCount += 1;
      else completedCount += 1;
    });
    setCounts({
      completed: completedCount,
      to_do: todoCount,
      in_progress: progressCount,
    });
    if (!searchQuery?.trim()?.length && !sortValue?.trim()?.length)
      setdata(tasks);
    else {
      let filteredData = [];
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
            const priorityOrder = { low: 1, medium: 2, high: 3 };
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
          return filteredData;
      }
      setdata(filteredData);
    }
  }, [tasks, searchQuery, sortValue]);

  const resetModal = (val) => {
    setStatus("add");
    setTaskId("");
    setModalOpen(val);
  };

  const viewTask = (id) => {
    setTaskId(id);
    setStatus("edit");
    setModalOpen(true);
  };

  const deleteTask = (id) => {
    dispatch(addTask(tasks?.filter((task) => task?.task_id !== id)));
  };

  const changeStatus = (id, val) => {
    let currentTaskIndex = tasks?.findIndex((task) => task?.task_id === id);
    let dummyTasks = [...tasks];
    let currentTask = dummyTasks[currentTaskIndex];
    currentTask = { ...currentTask, status: val };
    dummyTasks[currentTaskIndex] = currentTask;
    dispatch(addTask(dummyTasks));
  };

  const searchTask = (e) => {
    setSearchQuery(e?.target?.value);
    if (e?.target?.value?.trim()?.length > 3) {
    }
  };

  return (
    <div>
      <div className="header">
        <p className="content">Ultimate Task Manager</p>
        <p className="sub_content">
          Here you can add your daily tasks,edit or delete an already existing
          task. Also you can assign priority to tasks.You can also assign status
          to the tasks. Along with this you can also search and filter the tasks
          on the basis of priority,due date and completion status
        </p>
      </div>
      <Row gutter={24}>
        <Col className="gutter-row" span={10}>
          <div className="task_container">
            <div className="summary_data">
              <div>
                <p className="content">
                  Total Tasks-&nbsp;
                  <span className="highlight">{tasks?.length || 0}</span>
                </p>
                <p className="content">
                  Tasks not Started Yet-&nbsp;{" "}
                  <span className="highlight">{counts?.to_do || 0}</span>
                </p>
                <p className="content">
                  Tasks in Progress-&nbsp;
                  <span className="highlight">{counts?.in_progress || 0}</span>
                </p>
                <p className="content">
                  Completed Tasks-&nbsp;
                  <span className="highlight">{counts?.completed || 0}</span>
                </p>
                {sortValue && (
                  <Tag
                    className="tags"
                    color="orange"
                    closable
                    onClose={() => setSortValue("")}
                  >
                    Sorted By: {sortValue?.replaceAll("_", " ")}
                  </Tag>
                )}
              </div>
              <Button
                type="primary"
                color="#2db7f5"
                onClick={() => setModalOpen(true)}
              >
                Add a New Task
              </Button>
            </div>
            <div className="search_div">
              <p className="content">Search Tasks By Title or Description</p>
              <Input
                value={searchQuery}
                placeholder="Search"
                onChange={(e) => searchTask(e)}
                suffix={<SearchOutlined style={{ cursor: "pointer" }} />}
              />
            </div>
            <div className="sort_div">
              <p className="content">Sort By</p>
              <Radio.Group
                onChange={(e) => setSortValue(e?.target?.value)}
                value={sortValue}
              >
                <Radio value={"priority"} className="radio_content">
                  Priority
                </Radio>
                <Radio value={"due_date"} className="radio_content">
                  Due Date
                </Radio>
                <Radio value={"status"} className="radio_content">
                  Task Status
                </Radio>
              </Radio.Group>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" span={14}>
          <div className="task_container">
            {data?.length > 0 ? (
              <div>
                {data?.map((task) => {
                  return (
                    <div className="task_body" key={task?.task_id}>
                      <div className="task_details">
                        <div className="content">
                          {task?.title}
                          <Tag
                            color={
                              task?.priority === "low"
                                ? "yellow"
                                : task?.priority === "high"
                                ? "red"
                                : "green"
                            }
                            className="tags"
                          >
                            {task?.priority}
                          </Tag>
                        </div>
                        <div className="content_des">{task?.description}</div>
                      </div>
                      <div className="task_actions">
                        <Select
                          placeholder="Change Status"
                          style={{ width: "100%" }}
                          options={Task_Status}
                          value={task?.status}
                          allowClear
                          onChange={(e) => changeStatus(task?.task_id, e)}
                        />
                        <EditOutlined
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
                            className="icon"
                            style={{ color: "#f75555" }}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <p className="no_content">No Tasks Added Yet.</p>
              </>
            )}
          </div>
        </Col>
      </Row>
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
