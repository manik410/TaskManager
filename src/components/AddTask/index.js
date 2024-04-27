import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

//antd imports
import { Col, DatePicker, Input, message, Modal, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";

//reducer functions imports
import { addTask } from "../../redux/slice/addTaskSlice";

//helper functions imports
import { Priority_Options } from "../../helpers/constants";

//css imports
import "./AddTask.scss";

const AddTaskComponent = ({ modalOpen, setModalOpen, status, taskId }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "",
    status: "",
    task_id: "",
  });
  const { tasks } = useSelector((state) => state?.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "add") {
      resetValues();
    } else {
      setFormValues(tasks?.find((task) => task?.task_id === taskId));
    }
  }, [modalOpen]);

  //helper function for resetting the values
  const resetValues = () => {
    setFormValues({
      title: "",
      description: "",
      due_date: "",
      priority: "",
      status: "",
      task_id: "",
    });
  };

  //function for handling the field change values
  const onChange = (e, name) => {
    if (name === "due_date") setFormValues({ ...formValues, [name]: e });
    else if (name === "priority") setFormValues({ ...formValues, [name]: e });
    else setFormValues({ ...formValues, [name]: e?.target?.value });
  };

  //function for adding and editing the tasks
  const addEditTasks = () => {
    const { title, description, due_date, priority } = formValues;
    if (title?.length) {
      if (description?.length) {
        if (dayjs(due_date) > dayjs(new Date())) {
          if (priority?.length) {
            if (status === "add") {
              dispatch(
                addTask([
                  {
                    task_id: uuidv4(),
                    title: title,
                    description: description,
                    due_date: due_date,
                    priority: priority,
                    status: "To Do",
                  },
                  ...tasks,
                ])
              );
            } else {
              dispatch(
                addTask([
                  formValues,
                  ...tasks?.filter((task) => task?.task_id !== taskId),
                ])
              );
            }
            setModalOpen(false);
          } else message.error("Please select the Priority of the Task");
        } else
          message.error(
            "Please enter Due Date which should be greater than today's date"
          );
      } else message.error("Please enter the Description of the Task");
    } else message.error("Please enter the Title of the Task");
  };

  return (
    <Modal
      title={status === "add" ? "Add a new Task" : "Edit Task"}
      open={modalOpen}
      onOk={addEditTasks}
      onCancel={() => setModalOpen(false)}
      aria-labelledby={
        status === "add" ? "addTaskModalTitle" : "editTaskModalTitle"
      }
    >
      <Row>
        <Col className="field-row" span={24}>
          <Input
            maxLength={50}
            value={formValues?.title}
            placeholder="Enter Title"
            onChange={(e) => onChange(e, "title")}
            aria-label="Title"
          />
        </Col>
        <Col className="field-row" span={24}>
          <TextArea
            rows={4}
            placeholder="Enter Description"
            value={formValues?.description}
            onChange={(e) => onChange(e, "description")}
            aria-label="Description"
          />
        </Col>
        <Col className="field-row" span={24}>
          <DatePicker
            style={{ width: "100%" }}
            onChange={(e, val) => onChange(val, "due_date")}
            value={formValues?.due_date ? dayjs(formValues?.due_date) : null}
            placeholder="Select Due Date"
            aria-label="Due Date"
          />
        </Col>
        <Col className="field-row" span={24}>
          <Select
            placeholder="Select the Priority"
            style={{ width: "100%" }}
            options={Priority_Options}
            value={formValues?.priority || null}
            allowClear
            onChange={(e) => onChange(e, "priority")}
            aria-label="Priority"
          />
        </Col>
      </Row>
    </Modal>
  );
};
export default AddTaskComponent;
