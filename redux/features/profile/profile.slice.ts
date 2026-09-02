import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  name: string | null;
  email: string | null;
  createdAt: string | null;
  image: string | null;
  isFetched: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  name: null,
  email: null,
  createdAt: null,
  image: null,
  isFetched: false, // ← important: pehle false
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Pehli baar data set karne ke liye (server se aane ke baad)
    setProfile: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        createdAt: string;
        image: string | null;
      }>,
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.createdAt = action.payload.createdAt;
      state.image = action.payload.image;
      state.isFetched = true;
      state.error = null;
    },

    updateProfileLocally: (
      state,
      action: PayloadAction<
        Partial<{
          name: string;
          email: string;
          createdAt: string;
          image: string | null;
        }>
      >,
    ) => {
      state.name = action.payload.name!;
      state.email = action.payload.email!;
      state.createdAt = action.payload.createdAt!;
      state.image = action.payload.image!;
    },

    // Optional: error set karne ke liye
    setProfileError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isFetched = true;
    },

    clearProfile: () => initialState,
  },
});

export const { setProfile, updateProfileLocally, setProfileError, clearProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
