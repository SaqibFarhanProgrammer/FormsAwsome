// app/api/forms/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { deleteFormService } from "@/core/services/form/forms.service";

export async function DELETE(request: NextRequest) {
  try {
    const data = await deleteFormService(request, "delete");
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "DELETE FORM ERROR");
  }
}
