// app/api/forms/get-all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CatchErrorFunctionForRoute } from "@/utils/CatchErrorFunction";
import { getAllFormsService } from "@/core/services/Form/Forms.service";

export async function GET(request: NextRequest) {
  try {
    const data = await getAllFormsService();
    return NextResponse.json(
      {
        success: true,
        message: "Forms retrieved successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "GET ALL FORMS ERROR");
  }
}
