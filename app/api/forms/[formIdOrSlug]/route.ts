// app/api/forms/[formIdOrSlug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { getSingleFormService, updateFormService } from "@/core/services/form/forms.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formIdOrSlug: string }> },
) {
  try {
    const { formIdOrSlug } = await params;
    const data = await getSingleFormService(formIdOrSlug);
    return NextResponse.json(
      {
        success: true,
        message: "Form retrieved successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "GET SINGLE FORM ERROR");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formIdOrSlug: string }> },
) {
  try {
    const { formIdOrSlug } = await params;
    const data = await updateFormService(request, formIdOrSlug);
    return NextResponse.json(
      {
        success: true,
        message: "Form updated successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "UPDATE FORM ERROR");
  }
}
