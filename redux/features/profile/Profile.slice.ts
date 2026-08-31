import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProfileDataType } from "@/features/Profile/types/types";

interface ProfileState {
  data: ProfileDataType | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json() as Promise<ProfileDataType>;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileLocally: (state, action: PayloadAction<Partial<ProfileDataType>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateProfileLocally, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
