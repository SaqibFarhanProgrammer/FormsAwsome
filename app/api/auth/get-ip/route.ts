import { NextRequest, NextResponse } from "next/server";

function getClientIp(request: NextRequest): string {
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

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  return NextResponse.json({ ip });
}
