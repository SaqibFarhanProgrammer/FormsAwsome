import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./Counter.slice";
import formReducer from "@/redux/features/Create-form/Form.Slice";
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    form: formReducer,
  },
});
