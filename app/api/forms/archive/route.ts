// app/api/forms/archive/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CatchErrorFunctionForRoute } from "@/utils/CatchErrorFunction";
import { deleteFormService } from "@/core/services/Form/Forms.service";

export async function PATCH(request: NextRequest) {
  try {
    const data = await deleteFormService(request, "archive");
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "ARCHIVE FORM ERROR");
  }
}
