import { NextRequest, NextResponse } from "next/server";
import { createFormService, getAllFormsService } from "@/core/services/form/forms.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function GET() {
  try {
    const data = await getAllFormsService();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to load forms"),
      "GET FORMS ERROR",
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await createFormService(request);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to create form"),
      "CREATE FORM ERROR",
    );
  }
}
