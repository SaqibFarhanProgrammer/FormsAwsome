// app/api/auth/google/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const googleClientKey = process.env.GOOGLE_CLIENT_KEY;
  const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!googleClientKey || !googleRedirectUri) {
    return NextResponse.json({ error: "Google OAuth configuration is not set" }, { status: 500 });
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.set("client_id", googleClientKey);
  url.searchParams.set("redirect_uri", googleRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");

  return NextResponse.redirect(url.toString());
}
