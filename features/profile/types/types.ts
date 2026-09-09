export interface ProfileSettingsType {
  notifications?: boolean;
  privacy?: "public" | "private" | "friends";
  theme?: "system" | "light" | "dark";
}

export interface ProfileDataType {
  id: string;
  name: string;
  email: string;
  image: string;
  avatarUrl?: string;
  bio?: string;
  settings?: ProfileSettingsType;
  createdAt: string;
}
