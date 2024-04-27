import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mobile: false,
};

export const SystemSlice = createSlice({
  name: "system_config",
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.mobile = action?.payload;
    },
  },
});

export const { setMobile } = SystemSlice.actions;

export default SystemSlice.reducer;
