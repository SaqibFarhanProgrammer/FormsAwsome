import { AppError } from "@/lib/auth/appError";
import { ConnectionToRedis } from "@/lib/redis/redis";

export const AUTH_RATE_LIMIT = 5;
export const AUTH_RATE_LIMIT_WINDOW_SECONDS = 30 * 60;

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
  try {
    const redis = await ConnectionToRedis();
    const results = await redis.multi().incr(key).expire(key, windowSeconds, "NX").exec();
    const count = Number(results?.[0]);
    const ttl = await redis.ttl(key);

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfter: ttl > 0 ? ttl : windowSeconds,
    };
  } catch (error) {
    console.error("Error while checking auth rate limit:", error);
    throw new AppError("Error while checking auth rate limit", 500);
  }
}
