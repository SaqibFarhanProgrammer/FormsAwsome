import { cookies } from "next/headers";

export async function proxy() {

    const CookieStore =await cookies()

    const inCommingAccessToken = CookieStore.get("  ")







}
