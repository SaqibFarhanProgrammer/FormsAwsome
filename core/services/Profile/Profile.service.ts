// core/services/auth/Profile.service.ts
import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/AppError";
import { connectDB } from "@/core/DB/ConnectDB";
import { User } from "@/models/User.models";
import { verifyAccessToken } from "@/lib/auth/JWT.lib";
import { cookies } from "next/headers";
import { GetDataFromRedis, SetDataToRedisWithTTL } from "@/lib/redis/redis";

export async function GetProfileService(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new AppError("Access token not found", 401);
  }

  let payload;
  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    throw new AppError("Invalid access token", 401);
  }

  const userId = payload.userId;
  const cacheKey = `user:${userId}`;

  // Check Redis cache
  const cachedUser = await GetDataFromRedis(cacheKey);
  if (cachedUser) {
    return JSON.parse(cachedUser); // ← important
  }

  // Get from DB
  await connectDB();
  const user = await User.findById(userId).select("-passwordHash -refreshToken");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const profileData = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  // Store in Redis (24 hours TTL) - string me convert karo
  await SetDataToRedisWithTTL(
    cacheKey,
    JSON.stringify(profileData), // ← important
    86400,
  );

  return profileData;
}
