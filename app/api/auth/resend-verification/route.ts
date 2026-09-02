// app/api/auth/resend-verification/route.ts

import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/auth/appError";
import { connectDB } from "@/core/db/connectDb";
import { User } from "@/models/user.model";
import { SetDataToRedisWithTTL } from "@/lib/redis/redis";
import { generateVerificationToken } from "@/lib/auth/jwt.lib";
import { generateVerificationCode } from "@/lib/auth/verificationCode.lib";
import SendVerificationEmail from "@/features/node-mailer/nodemailer.config";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.emailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    const verificationCode = generateVerificationCode();
    const redisKey = `verification:${user.email}`;
    await SetDataToRedisWithTTL(redisKey, verificationCode, 600); // 600 seconds = 10 minutes
    const verificationToken = generateVerificationToken(user.email, user.name);

    await SendVerificationEmail({
      code: verificationCode,
      email: user.email,
      name: user.name,
    });

    const encodedEmail = encodeURIComponent(user.email);
    const verifyUrl = `/auth/verify-email?email=${encodedEmail}&token=${verificationToken}`;

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent. Please check your inbox.",
        verifyUrl,
      },
      { status: 200 },
    );
  } catch (error: any) {
    CatchErrorFunctionForRoute(error, "RESEND VERIFICATION EMAIL ERROR");
  }
}
