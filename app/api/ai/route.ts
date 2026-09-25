import { AiHistoryMessage, geminiai } from "@/features/Ai-Form-Generator/Ai.service";
import { AppError } from "@/lib/auth/appError";
import { getUserIdFromToken } from "@/lib/auth/jwt.lib";
import { getRateLimitStatus, rateLimit } from "@/lib/auth/rateLimit";
import { ConnectionToRedis } from "@/lib/redis/redis";
import { NextRequest, NextResponse } from "next/server";

const AI_RATE_LIMIT = 3;
const AI_RATE_LIMIT_WINDOW_SECONDS = 60 * 60 * 24;
const HISTORY_TTL_SECONDS = 60 * 60 * 24 * 30;

function getHistoryKey(userId: string) {
  return `ai:history:${userId}`;
}

async function getHistory(userId: string): Promise<AiHistoryMessage[]> {
  const redis = await ConnectionToRedis();
  const value = await redis.get(getHistoryKey(userId));

  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as AiHistoryMessage[]).slice(-12) : [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const userId = String(await getUserIdFromToken());
    const history = await getHistory(userId);
    const usage = await getRateLimitStatus({
      name: "ai-generation",
      identifier: userId,
      limit: AI_RATE_LIMIT,
      windowSeconds: AI_RATE_LIMIT_WINDOW_SECONDS,
    });

    return NextResponse.json({
      ok: true,
      history,
      used: usage.used,
      remaining: usage.remaining,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.statusCode });
    }

    console.error("AI history error:", error);
    return NextResponse.json({ ok: false, error: "Unable to load AI history" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = String(await getUserIdFromToken());
    const body = (await request.json()) as {
      prompt?: unknown;
      currentForm?: unknown;
    };
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ ok: false, error: "A prompt is required" }, { status: 400 });
    }

    const usage = await rateLimit({
      name: "ai-generation",
      identifier: userId,
      limit: AI_RATE_LIMIT,
      windowSeconds: AI_RATE_LIMIT_WINDOW_SECONDS,
    });
    if (!usage.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: "Free tier limit reached. You can send 3 AI messages per day.",
          error: "Free tier limit reached. You can send 3 AI messages per day.",
          used: usage.used,
          remaining: 0,
        },
        { status: 429, headers: { "Retry-After": String(usage.retryAfter) } },
      );
    }

    const history = await getHistory(userId);
    const result = await geminiai(prompt, history, body.currentForm ?? null);

    if (!result) {
      throw new AppError("Unable to fulfill your request right now", 502);
    }

    const parseResult = JSON.parse(result) as {
      message: string;
      formData: unknown;
    };
    const updatedHistory = [
      ...history,
      { role: "user" as const, content: prompt },
      { role: "assistant" as const, content: parseResult.message },
    ].slice(-12);
    const redis = await ConnectionToRedis();
    await redis.set(getHistoryKey(userId), JSON.stringify(updatedHistory), {
      EX: HISTORY_TTL_SECONDS,
    });

    return NextResponse.json({
      ok: true,
      result: parseResult,
      history: updatedHistory,
      used: usage.used,
      remaining: usage.remaining,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ ok: false, error: error.message }, { status: error.statusCode });
    }

    console.error("AI GET route error:", error);
    return Response.json({ ok: false, error: "AI service failed" }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = (await request.json()) as { query?: unknown };

//     if (typeof body.query !== "string" || !body.query.trim()) {
//       return Response.json({ error: "A non-empty query is required" }, { status: 400 });
//     }

//     const result = await mistralai(body.query.trim());
//     return Response.json(result);
//   } catch (error) {
//     if (error instanceof AppError) {
//       return Response.json({ error: error.message }, { status: error.statusCode });
//     }

//     console.error("AI route error:", error);
//     return Response.json({ error: "AI service failed" }, { status: 500 });
//   }
// }
