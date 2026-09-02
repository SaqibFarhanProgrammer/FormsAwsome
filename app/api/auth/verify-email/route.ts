// app/api/auth/verify-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/auth/AppError";
import { connectDB } from "@/core/db/connectDb";
import { User } from "@/models/user.model";
import { GetDataFromRedis, DeleteDataFromRedis } from "@/lib/redis/redis";
import { verifyVerificationToken, generateTokens } from "@/lib/auth/jwt.lib";
import { CatchErrorFunctionForRoute } from "@/utils/CatchErrorFunction";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, token } = body;

    if (!email || !code || !token) {
      throw new AppError("Email, code, and token are required", 400);
    }

    let decodedToken;
    try {
      decodedToken = verifyVerificationToken(token);
    } catch (error: any) {
      throw new AppError("Invalid or expired verification token", 401);
    }

    if (decodedToken.email !== email) {
      throw new AppError("Email mismatch with token", 400);
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.emailVerified) {
      // Generate access and refresh tokens
      const { accessToken, refreshToken } = generateTokens(user._id, user.email);

      // Create response
      const response = NextResponse.json(
        {
          success: true,
          message: "Email already verified",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            emailVerified: true,
          },
        },
        { status: 200 },
      );

      // Set cookies
      response.cookies.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 1 day
        path: "/",
      });

      response.cookies.set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    }

    const redisKey = `verification:${email.toLowerCase().trim()}`;
    const storedCode = await GetDataFromRedis(redisKey);

    if (!storedCode) {
      throw new AppError("Verification code expired or not found. Please request a new one.", 400);
    }

    if (code !== storedCode) {
      throw new AppError("Invalid verification code", 400);
    }

    user.emailVerified = true;
    await user.save();

    await DeleteDataFromRedis(redisKey);

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.email);

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: true,
        },
      },
      { status: 200 },
    );

    // Set cookies
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day
      path: "/",
    });

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return await CatchErrorFunctionForRoute(error, "VERIFY EMAIL ERROR");
  }
}
