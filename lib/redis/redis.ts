import { createClient, RedisClientType } from "redis";
import { AppError } from "../auth/AppError";

const URL = process.env.REDIS_URL;

let redisClient: RedisClientType | null = null;

export async function ConnectionToRedis(): Promise<RedisClientType> {
  if (!URL) {
    throw new Error("REDIS_URL is not defined");
  }

  try {
    if (redisClient && redisClient.isOpen) {
      console.log("Redis Already COnnected");

      return redisClient;
    }

    redisClient = createClient({ url: URL });

    redisClient.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis COnnected");
    }

    return redisClient;
  } catch (error) {
    console.error("Error while creating Redis connection:", error);
    redisClient = null;
    throw new AppError("Error while connecting to Redis", 500);
  }
}

export async function SetDataToRedis(key: string, value: string): Promise<void> {
  try {
    const redis = await ConnectionToRedis();
    await redis.set(key, value, { EX: 3600 });
  } catch (error) {
    console.error("Error while setting data to Redis:", error);
    throw new AppError("Error while setting data to Redis", 500);
  }
}

export async function SetDataToRedisWithTTL(
  key: string,
  value: string,
  ttlSeconds: number,
): Promise<void> {
  try {
    const redis = await ConnectionToRedis();
    await redis.set(key, value, { EX: ttlSeconds });
  } catch (error) {
    console.error("Error while setting data to Redis with TTL:", error);
    throw new AppError("Error while setting data to Redis with TTL", 500);
  }
}

export async function GetDataFromRedis(key: string): Promise<string | null> {
  try {
    const redis = await ConnectionToRedis();
    return await redis.get(key);
  } catch (error) {
    console.error("Error while getting data from Redis:", error);
    throw new AppError("Error while getting data from Redis", 500);
  }
}

export async function IsDataExitsInRedis(key: string): Promise<boolean> {
  try {
    const redis = await ConnectionToRedis();
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error("Error while checking data existence in Redis:", error);
    throw new AppError("Error while checking data existence in Redis", 500);
  }
}

export async function DeleteDataFromRedis(key: string) {
  try {
    const redis = await ConnectionToRedis();
    await redis.del(key);
  } catch (error) {
    console.error("Error while checking data existence in Redis:", error);
    throw new AppError("Error while checking data existence in Redis", 500);
  }
}
