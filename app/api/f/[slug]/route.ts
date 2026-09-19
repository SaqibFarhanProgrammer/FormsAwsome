// app/api/f/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { getPublicFormService, submitFormService } from "@/core/services/form/forms.service";
import { getUserIP } from "@/lib/auth/rateLimit";

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

    const data = await submitFormService(slug, await request.json(), getUserIP(request));

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
