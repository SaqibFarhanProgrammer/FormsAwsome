import mongoose from "mongoose";

export type ProfileSettingsType = {
  notifications?: boolean;
  privacy?: "public" | "private" | "friends";
  theme?: "system" | "light" | "dark";
};

export type UserType = {
  name: string;
  email: string;
  passwordHash: string | null;
  image?: string;
  avatarUrl?: string;
  bio?: string;
  settings?: ProfileSettingsType;
  emailVerified: boolean;
  refreshToken?: string;
  refreshTokenExpiry?: Date;
};

const userSchema = new mongoose.Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      default: null,
    },
    image: {
      type: String,
      default: "https://i.pinimg.com/736x/1a/81/7a/1a817a95a42d8c43031378d122a05ffe.jpg",
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      privacy: {
        type: String,
        enum: ["public", "private", "friends"],
        default: "public",
      },
      theme: {
        type: String,
        enum: ["system", "light", "dark"],
        default: "system",
      },
    },
    refreshToken: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    refreshTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model<UserType>("User", userSchema);
