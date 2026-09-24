import { AppError } from "@/lib/auth/appError";
import { mistralai } from "@/features/Ai-Form-Generator/Ai.service";

export async function GET(request: Request) {
  try {
    const result = await mistralai("hello");
    return Response.json({ ok: true, result });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ ok: false, error: error.message }, { status: error.statusCode });
    }

    console.error("AI GET route error:", error);
    return Response.json({ ok: false, error: "AI service failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: unknown };

    if (typeof body.query !== "string" || !body.query.trim()) {
      return Response.json({ error: "A non-empty query is required" }, { status: 400 });
    }

    const result = await mistralai(body.query.trim());
    return Response.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("AI route error:", error);
    return Response.json({ error: "AI service failed" }, { status: 500 });
  }
}
