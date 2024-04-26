import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

export const AddTaskSlice = createSlice({
  name: "addTask",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks = action?.payload;
    },
  },
});

export const { addTask } = AddTaskSlice.actions;

export default AddTaskSlice.reducer;
