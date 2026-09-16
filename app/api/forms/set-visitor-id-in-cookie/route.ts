import { GenerateVisitoriD } from "@/features/form-builder/utils/VisitorIdGenerator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let visitorId = req.cookies.get("VisitorId")?.value;

    const response = NextResponse.json({
      success: true,
      visitorId,
    });

    if (!visitorId) {
      visitorId = GenerateVisitoriD();

      response.cookies.set("VisitorId", visitorId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
