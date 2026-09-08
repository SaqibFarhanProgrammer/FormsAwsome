import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl: string;
  notifyEmail: string;
}

interface CreateFormPayload {
  title: string;
  description: string;
  fields: FormField[];
  slug: string;
  settings?: FormSettings;
}

interface FormCreateState {
  isLoading: boolean;
  error: string | null;
  createdForm: unknown | null;
}

const initialState: FormCreateState = {
  isLoading: false,
  error: null,
  createdForm: null,
};

export const createForm = createAsyncThunk(
  "formCreate/createForm",
  async (data: CreateFormPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/forms/create", {
        title: data.title,
        description: data.description,
        fields: data.fields ?? [],
        slug: data.slug,
        settings: data.settings ?? {
          submitButtonText: "Submit",
          successMessage: "Thank you for your submission!",
          redirectUrl: "",
          notifyEmail: "",
        },
      });

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? error.message ?? "An error occurred",
        );
      }

      return rejectWithValue("An error occurred");
    }
  },
);

const formCreateSlice = createSlice({
  name: "formCreate",
  initialState,

  reducers: {
    clearCreateFormError: (state) => {
      state.error = null;
    },

    resetCreateForm: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(createForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(createForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdForm = action.payload;
      })

      .addCase(createForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCreateFormError, resetCreateForm } = formCreateSlice.actions;

export default formCreateSlice.reducer;
