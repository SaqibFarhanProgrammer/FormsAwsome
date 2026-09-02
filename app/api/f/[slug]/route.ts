// app/api/f/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { getPublicFormService } from "@/core/services/form/forms.service";

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
  } catch (error: any) {
    return CatchErrorFunctionForRoute(error, "GET PUBLIC FORM ERROR");
  }
}

// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ slug: string }> }
// ) {
//   try {
//     const { slug } = await params;
//     const body = await request.json();

//     const data = await submitFormService(slug, body);
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Form submitted successfully",
//         data,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return CatchErrorFunctionForRoute(error, "SUBMIT FORM ERROR");
//   }
// }
