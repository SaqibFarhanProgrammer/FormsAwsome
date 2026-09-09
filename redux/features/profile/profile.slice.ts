import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileSettingsState {
  notifications?: boolean;
  privacy?: "public" | "private" | "friends";
  theme?: "system" | "light" | "dark";
}

interface ProfileState {
  name: string | null;
  email: string | null;
  createdAt: string | null;
  image: string | null;
  bio: string | null;
  settings: ProfileSettingsState;
  isFetched: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  name: null,
  email: null,
  createdAt: null,
  image: null,
  bio: null,
  settings: {
    notifications: true,
    privacy: "public",
    theme: "system",
  },
  isFetched: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        createdAt: string;
        image: string | null;
        bio?: string | null;
        settings?: ProfileSettingsState;
      }>,
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.createdAt = action.payload.createdAt;
      state.image = action.payload.image;
      state.bio = action.payload.bio ?? null;
      state.settings = {
        notifications: action.payload.settings?.notifications ?? true,
        privacy: action.payload.settings?.privacy ?? "public",
        theme: action.payload.settings?.theme ?? "system",
      };
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
          bio: string | null;
          settings: ProfileSettingsState;
        }>
      >,
    ) => {
      state.name = action.payload.name ?? state.name;
      state.email = action.payload.email ?? state.email;
      state.createdAt = action.payload.createdAt ?? state.createdAt;
      state.image = action.payload.image ?? state.image;
      state.bio = action.payload.bio ?? state.bio;

      if (action.payload.settings) {
        state.settings = {
          notifications: action.payload.settings.notifications ?? state.settings.notifications,
          privacy: action.payload.settings.privacy ?? state.settings.privacy,
          theme: action.payload.settings.theme ?? state.settings.theme,
        };
      }
    },

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
