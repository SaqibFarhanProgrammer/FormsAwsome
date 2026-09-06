import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function GET(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const ip =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;

  const country = request.headers.get("x-vercel-ip-country") ?? "Unknown";

  const region = request.headers.get("x-vercel-ip-country-region") ?? "Unknown";

  const city = request.headers.get("x-vercel-ip-city") ?? "Unknown";

  return NextResponse.json({
    ip,
    userAgent,
    browser: result.browser.name ?? "Unknown",
    os: result.os.name ?? "Unknown",
    device: result.device.type ?? "desktop",
    country,
    region,
    city,
  });
}
