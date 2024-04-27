import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

//custom component imports
import TaskList from "./components/TaskList";

//helper functions imports
import { handleResize } from "./helpers/constants";

//css imports
import "./index.scss";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, false);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return <TaskList />;
};

export default App;
