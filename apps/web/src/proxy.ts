import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/i18n/locales";
import { pickLocale } from "@/i18n/pickLocale";

// Only the bare domain is redirected. Any URL that already names a
// language (e.g. a shared /fa link) renders as-is, whatever the visitor's
// browser, country or saved choice.
export function proxy(request: NextRequest) {
  const locale = pickLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    // Set by Vercel's edge network; absent locally.
    country: request.headers.get("x-vercel-ip-country"),
  });

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  // 307: the target depends on the visitor, so it must never be cached as
  // a permanent redirect.
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: "/",
};
