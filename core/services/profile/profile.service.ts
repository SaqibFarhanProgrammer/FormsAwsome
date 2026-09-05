// core/services/auth/Profile.service.ts
import { AppError } from "@/lib/auth/appError";
import { connectDB } from "@/core/db/connectDb";
import { User } from "@/models/user.model";
import { verifyAccessToken } from "@/lib/auth/jwt.lib";
import { cookies } from "next/headers";
import { GetDataFromRedis, SetDataToRedisWithTTL } from "@/lib/redis/redis";

export async function GetProfileService() {
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

  const cachedUser = await GetDataFromRedis(cacheKey);
  if (cachedUser) {
    console.log("from cached");

    return JSON.parse(cachedUser);
  }

  await connectDB();
  const user = await User.findById(userId).select("name email image createdAt");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const profileData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt.toString(),
  };

  await SetDataToRedisWithTTL(
    cacheKey,
    JSON.stringify(profileData),
    3600, // 1 hr
  );

  console.log("from DB");

  return profileData;
}
