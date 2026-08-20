import mongoose from "mongoose";

export type UserTypes = {
  _id: mongoose.Types.ObjectId | string;
  Name: string;
  Email: string;
  Password: string;
  Image?: string;
  RefreshToken?: string;
  RefreshTokenExpiry?: Date;
  createdAt: Date | string;
};

const userSchema = new mongoose.Schema<UserTypes>(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      default: "https://i.pinimg.com/736x/1a/81/7a/1a817a95a42d8c43031378d122a05ffe.jpg",
    },
    RefreshToken: {
      type: String,
    },
    RefreshTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model<UserTypes>("User", userSchema);
