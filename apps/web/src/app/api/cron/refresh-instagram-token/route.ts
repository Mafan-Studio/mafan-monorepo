import { NextResponse } from "next/server";
import { getInstagramAccessToken } from "@/lib/instagram";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Instagram long-lived tokens expire after 60 days unless refreshed. Vercel
// Cron calls this weekly (see vercel.json) with
// `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = await getInstagramAccessToken();
  if (!token) {
    // Instagram not connected yet: nothing to keep alive.
    return NextResponse.json({ ok: true, refreshed: false });
  }

  try {
    const url = new URL("https://graph.instagram.com/refresh_access_token");
    url.searchParams.set("grant_type", "ig_refresh_token");
    url.searchParams.set("access_token", token);

    const response = await fetch(url, { cache: "no-store" });
    const body: unknown = await response.json().catch(() => null);

    const refreshed =
      body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const accessToken = refreshed.access_token;
    const expiresIn = refreshed.expires_in;

    if (
      !response.ok ||
      typeof accessToken !== "string" ||
      typeof expiresIn !== "number"
    ) {
      console.error("Instagram token refresh failed", response.status, body);
      return NextResponse.json({ error: "refresh_failed" }, { status: 502 });
    }

    const now = new Date();
    const { error } = await supabaseAdmin
      .from("instagram_credentials")
      .update({
        access_token: accessToken,
        expires_at: new Date(now.getTime() + expiresIn * 1000).toISOString(),
        refreshed_at: now.toISOString(),
      })
      .eq("id", 1);

    if (error) {
      console.error("Failed to store refreshed Instagram token", error);
      return NextResponse.json({ error: "store_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, refreshed: true });
  } catch (error) {
    console.error("Instagram token refresh failed", error);
    return NextResponse.json({ error: "refresh_failed" }, { status: 502 });
  }
}
