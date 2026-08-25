import mongoose from "mongoose";

export type UserType = {
  name: string;
  email: string;
  passwordHash: string | null;
  image?: string;
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
