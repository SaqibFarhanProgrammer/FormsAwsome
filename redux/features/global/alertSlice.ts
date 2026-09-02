import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AlertType = "success" | "danger" | "warning";

interface AlertState {
  message: string | null;
  type: AlertType;
  duration: number;
}

const initialState: AlertState = {
  message: null,
  type: "success",
  duration: 3000,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<{
        message: string;
        type: AlertType;
        duration?: number;
      }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.duration = action.payload.duration ?? 3000;
    },

    hideAlert: (state) => {
      state.message = null;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;

export default alertSlice.reducer;