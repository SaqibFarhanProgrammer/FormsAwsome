import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "@/lib/auth/appError";
import { verifyAccessToken } from "@/lib/auth/jwt.lib";
import { connectDB } from "@/core/db/connectDb";
import { GetProfileService, serializeProfileData } from "@/core/services/profile/profile.service";
import { User } from "@/models/user.model";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { DeleteDataFromRedis } from "@/lib/redis/redis";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadProfileImage(file: File) {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new AppError("Cloudinary environment variables are not configured", 500);
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "forms-awesome/profiles",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(new AppError("Unable to upload profile image", 500));
          return;
        }

        resolve(result.secure_url);
      },
    );

    uploadStream.end(fileBuffer);
  });
}

function parseSettings(formData: FormData) {
  const rawSettings = formData.get("settings");

  if (!rawSettings) {
    return {};
  }

  try {
    const parsedSettings = JSON.parse(String(rawSettings));
    return parsedSettings && typeof parsedSettings === "object" ? parsedSettings : {};
  } catch {
    return {};
  }
}

export async function GET() {
  try {
    const data = await GetProfileService();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to load profile"),
      "GET PROFILE ERROR",
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new AppError("Access token not found", 401);
    }

    const payload = verifyAccessToken(accessToken);

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const bio = String(formData.get("bio") || "").trim();
    const settings = parseSettings(formData);
    const imageFile = formData.get("image");

    if (
      !name &&
      !email &&
      !bio &&
      !(imageFile instanceof File && imageFile.size > 0) &&
      Object.keys(settings).length === 0
    ) {
      throw new AppError("No profile changes were provided", 400);
    }

    let uploadedImageUrl: string | undefined;

    if (imageFile instanceof File && imageFile.size > 0) {
      uploadedImageUrl = await uploadProfileImage(imageFile);
    }

    await connectDB();

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      const normalizedEmail = email.toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });

      if (existingUser) {
        throw new AppError("Email is already in use", 409);
      }

      user.email = normalizedEmail;
      user.emailVerified = false;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (Object.keys(settings).length > 0) {
      user.settings = {
        notifications: settings.notifications ?? user.settings?.notifications ?? true,
        privacy: settings.privacy ?? user.settings?.privacy ?? "public",
        theme: settings.theme ?? user.settings?.theme ?? "system",
      };
    }

    if (uploadedImageUrl) {
      user.image = uploadedImageUrl;
      user.avatarUrl = uploadedImageUrl;
    }

    await user.save();
    await DeleteDataFromRedis(`user:${payload.userId}`);

    const updatedProfile = serializeProfileData(user);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to update profile"),
      "PATCH PROFILE ERROR",
    );
  }
}
