export const Priority_Options = [
  { value: "High", label: "High" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
];
export const Task_Count_Category = [
  { label: "Total Tasks", value: "total_count", color: "rgb(66, 165, 245)" },
  { label: "Tasks not Started Yet", value: "to_do", color: "rgb(211, 47, 47)" },
  {
    label: "Tasks in Progress",
    value: "in_progress",
    color: "rgb(255, 152, 0)",
  },
  { label: "Completed Tasks", value: "completed", color: "#4CAF50" },
];

export const Task_Status = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];
export const Sort_Options = [
  { value: "priority", label: "Priority" },
  { value: "due_date", label: "Due Date" },
  { value: "status", label: "Status" },
];
export const FilterSvg = ({ disabled }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 18H9V16H3V18ZM3 6V8H21V6H3ZM3 13H15V11H3V13Z"
        fill={disabled ? "rgba(0, 0, 0, 0.25)" : "#4096ff"}
      />
    </svg>
  );
};
