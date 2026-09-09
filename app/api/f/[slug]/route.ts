// app/api/f/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { getPublicFormService, submitFormService } from "@/core/services/form/forms.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await getPublicFormService(slug);
    return NextResponse.json(
      {
        success: true,
        message: "Form retrieved successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unknown public form error"),
      "GET PUBLIC FORM ERROR",
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const userAgent = request.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const data = await submitFormService(slug, await request.json(), {
      ip:
        request.headers.get("x-vercel-forwarded-for") ??
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        undefined,
      userAgent,
      region: request.headers.get("x-vercel-ip-country-region") || undefined,
      country: request.headers.get("x-vercel-ip-country") || undefined,
      countryCode: request.headers.get("x-vercel-ip-country") || undefined,
      city: request.headers.get("x-vercel-ip-city") || undefined,
      browser: result.browser.name || undefined,
      os: result.os.name || undefined,
      device: result.device.type || "unknown",
    });

    return NextResponse.json(
      { success: true, message: "Form submitted successfully", data },
      { status: 201 },
    );
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unknown submission error"),
      "SUBMIT FORM ERROR",
    );
  }
}
