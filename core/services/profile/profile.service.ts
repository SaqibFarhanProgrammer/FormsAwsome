// core/services/auth/Profile.service.ts
import { AppError } from "@/lib/auth/appError";
import { connectDB } from "@/core/db/connectDb";
import { User } from "@/models/user.model";
import { verifyAccessToken } from "@/lib/auth/jwt.lib";
import { cookies } from "next/headers";
import { GetDataFromRedis, SetDataToRedisWithTTL } from "@/lib/redis/redis";

const DEFAULT_PROFILE_IMAGE =
  "https://i.pinimg.com/736x/1a/81/7a/1a817a95a42d8c43031378d122a05ffe.jpg";

export function serializeProfileData(user: any) {
  const image = user.image || user.avatarUrl || DEFAULT_PROFILE_IMAGE;
  const settings = {
    notifications: true,
    privacy: "public",
    theme: "system",
    ...(user.settings || {}),
  };

  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
    image,
    avatarUrl: user.avatarUrl || image,
    bio: user.bio || "",
    settings,
    createdAt: user.createdAt ? user.createdAt.toString() : new Date().toISOString(),
  };
}

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
    return JSON.parse(cachedUser);
  }

  await connectDB();
  const user = await User.findById(userId).select(
    "name email image avatarUrl bio settings createdAt",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const profileData = serializeProfileData(user);

  await SetDataToRedisWithTTL(cacheKey, JSON.stringify(profileData), 3600);

  return profileData;
}
