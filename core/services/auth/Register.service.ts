// core/services/auth/Register.service.ts

import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/AppError";
import { hashPassword } from "@/utils/CatchErrorFunction"; // apna path
import { connectDB } from "@/core/DB/ConnectDB";
import { User } from "@/models/User.models";
import { generateTokens } from "@/lib/auth/JWT.lib";
import { cookies } from "next/headers";

export async function RegisterUserService(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  await connectDB();

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  const { accessToken, refreshToken } = generateTokens(user._id, user.email);

  user.refreshToken = refreshToken;
  await user.save();

  // Cookies set karo
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Sirf data return karo
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
}
