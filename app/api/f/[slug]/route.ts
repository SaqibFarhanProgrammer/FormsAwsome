// app/api/f/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
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
    const data = await submitFormService(slug, await request.json(), {
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: request.headers.get("user-agent") || undefined,
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
