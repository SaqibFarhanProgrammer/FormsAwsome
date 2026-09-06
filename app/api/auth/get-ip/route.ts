import { NextResponse } from "next/server";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export async function GET(request: Request) {
  const ip = getClientIp(request);

  return NextResponse.json({ ip });
}
