import { configureStore } from "@reduxjs/toolkit";

import formReducer from "@/redux/features/form-builder/form-create.slice";
import formCreateReducer from "@/redux/features/form-builder/form-create.slice";
import profileReducer from "@/redux/features/profile/profile.slice";
import alertReducer from "@/redux/features/global/alertSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    profile: profileReducer,
    formCreate: formCreateReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
