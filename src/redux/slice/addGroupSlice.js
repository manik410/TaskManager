import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: {
    1: { min: "1", max: "10" },
  },
};

export const AddGroupSlice = createSlice({
  name: "addGroup",
  initialState,
  reducers: {
    addGroupData: (state, action) => {
      state.groups = action?.payload;
    },
  },
});

export const { addGroupData } = AddGroupSlice.actions;

export default AddGroupSlice.reducer;
