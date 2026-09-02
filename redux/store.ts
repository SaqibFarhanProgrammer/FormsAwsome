import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./Counter.slice";

import formReducer from "@/redux/features/Create-form/Form.Slice";
import formCreateReducer from "@/redux/features/Form-builder/Form-Create.slice";
import profileReducer from "@/redux/features/profile/Profile.slice";
import alertReducer from "@/redux/features/global/alertSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    form: formReducer,
    profile: profileReducer,
    formCreate: formCreateReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
