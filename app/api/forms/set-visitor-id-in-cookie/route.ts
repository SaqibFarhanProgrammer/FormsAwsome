// 1) Request aata hai /f/[slug] pe — middleware.ts mein match karo /^\/f\/([^/]+)/ se slug nikaalo.

// 2) request.cookies.get(slug) check karo.

// 3) Agar cookie exists — visitorId cookie se le lo, koi naya set mat karo.

// 4) Agar cookie exists nahi — crypto.randomUUID() se naya visitorId banao.

// 5) response.cookies.set(slug, visitorId, { maxAge: 1 year, httpOnly: true, sameSite: "lax" }).

// 6) request.cookies.set(slug, visitorId) bhi karo taake same request ke andar page/route ko turant naya id mil jaye (NextResponse.next({ request })).

// 7) Dono cases (exists ya not-exists) ke baad — same path pe converge karo, /api/track-views ko call karo. Koi bhi branch dead-end pe "return nothing" mat karo.

// 8) /api/track-views ka body: { formSlug, visitorId } — IP nahi.

// 9) Route handler (Node runtime) mein: Redis key Form-View-[slug]-visitorid-v[visitorId] pe SET NX EX 86400 chalao.

// 10) Result "OK" ho (naya key bana) — PFADD Form-View-[slug] visitorId chalao (unique visitor count).

// 11) Result null ho (key already thi) — PFADD skip mat karo agar total-views counter chahiye; separate unconditional INCR views:total:[slug] chalao yahan, gate ke bina.

// 12) NX success ho (naya visit) — SADD views:dirty_forms [slug] karo. Direct DB write mat karo yahan.

// 13) BullMQ repeatable job (2-5 min) — views:dirty_forms set read karo, har dirty form ke liye Redis se delta lo (Lua script), Mongo FormViewStats daily bucket $inc karo, phir set se slug remove karo.

import { TrackFormViews } from "@/core/services/form/forms.service";
import { GenerateVisitoriD } from "@/features/form-builder/utils/VisitorIdGenerator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let visitorid;

    const body = await req.json();

    const slug = body.slug;

    const response = NextResponse.json({
      success: true,
      visitorId: visitorid,
    });

    const cookiesStored = req.cookies.get(slug.toString())?.value;

    if (cookiesStored) {
      visitorid = cookiesStored;

      await TrackFormViews(slug, visitorid);

      return response;
    }

    if (!visitorid) {
      visitorid = GenerateVisitoriD();

      response.cookies.set(slug, visitorid, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day in seconds
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      });
    }

    await TrackFormViews(slug, visitorid);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
