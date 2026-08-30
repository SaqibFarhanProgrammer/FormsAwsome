import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./Counter.slice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
