// app/api/forms/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { createFormService } from "@/core/services/form/forms.service";

export async function POST(request: NextRequest) {
  try {
    const data = await createFormService(request);
    return NextResponse.json(
      {
        success: true,
        message: "Form created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "CREATE FORM ERROR");
  }
}
