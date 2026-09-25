import { AppError } from "@/lib/auth/appError";
import { ConnectionToRedis } from "@/lib/redis/redis";
import { headers } from "next/headers";

export const AUTH_RATE_LIMIT = 5;
export const AUTH_RATE_LIMIT_WINDOW_SECONDS = 60 * 60 * 2;

export type RateLimitOptions = {
  name: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  allowed: boolean;
  used: number;
  remaining: number;
  retryAfter: number;
};

export function getUserIP(request: Request): string {
  const forwardedFor =
    request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function getUserIPFromServer() {
  const headerStore = await headers();

  // 1. Check X-Forwarded-For (standard for multi-hop proxies/CDNs)
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    // The first IP in the list is the original client
    return forwardedFor.split(",")[0].trim();
  }

  // 2. Check X-Real-IP (common fallback for Nginx/reverse proxies)
  const realIP = headerStore.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // 3. Vercel-specific fallback if deploying on Vercel
  const vercelIP = headerStore.get("x-vercel-forwarded-for");
  if (vercelIP) {
    return vercelIP;
  }

  return "Unknown";
}

export const getClientIp = getUserIP;

function getRateLimitKey(name: string, identifier: string) {
  return `rate-limit:${name}:${identifier}`;
}

export async function rateLimit({
  name,
  identifier,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  try {
    const redis = await ConnectionToRedis();
    const key = getRateLimitKey(name, identifier);
    const count = Number(
      await redis.eval(
        `local count = redis.call('INCR', KEYS[1])
         if count == 1 then redis.call('EXPIREAT', KEYS[1], ARGV[1]) end
         return count`,
        {
          keys: [key],
          arguments: [String(Math.floor(Date.now() / 1000) + windowSeconds)],
        },
      ),
    );
    const ttl = await redis.ttl(key);

    return {
      allowed: count <= limit,
      used: count,
      remaining: Math.max(0, limit - count),
      retryAfter: ttl > 0 ? ttl : windowSeconds,
    };
  } catch (error) {
    console.error("Error while checking auth rate limit:", error);
    throw new AppError("Error while checking auth rate limit", 500);
  }
}

export async function getRateLimitStatus({
  name,
  identifier,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  try {
    const redis = await ConnectionToRedis();
    const count = Number((await redis.get(getRateLimitKey(name, identifier))) || 0);
    const ttl = await redis.ttl(getRateLimitKey(name, identifier));

    return {
      allowed: count < limit,
      used: count,
      remaining: Math.max(0, limit - count),
      retryAfter: ttl > 0 ? ttl : windowSeconds,
    };
  } catch (error) {
    console.error("Error while reading auth rate limit:", error);
    throw new AppError("Error while reading auth rate limit", 500);
  }
}
