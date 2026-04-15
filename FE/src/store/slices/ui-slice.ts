import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  counter: number;
};

const initialState: UiState = {
  counter: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    increment: (state) => {
      state.counter += 1;
    },
  },
});

export const { increment } = uiSlice.actions;
export default uiSlice.reducer;
