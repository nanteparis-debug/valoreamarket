import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Country to default language mapping
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  // Arab countries
  SA: "ar", AE: "ar", QA: "ar", KW: "ar", OM: "ar", BH: "ar",
  EG: "ar", IQ: "ar", JO: "ar", LB: "ar", DZ: "ar", TN: "ar",
  LY: "ar", SD: "ar", YE: "ar", SY: "ar",
  // Multilingual Arab/French countries (e.g., Morocco)
  MA: "ar",
  // Francophone countries
  FR: "fr", BE: "fr", CH: "fr", CA: "en", SN: "fr", CI: "fr",
  // Hispanic countries
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es",
  // German speaking
  DE: "de", AT: "de",
  // Russian speaking
  RU: "ru", KZ: "ru", BY: "ru",
  // Asian
  CN: "zh-Hans", HK: "zh-Hans", TW: "zh-Hans",
  JP: "ja",
  // Anglophone
  US: "en", GB: "en", AU: "en", NZ: "en", SG: "en",
};

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a supported locale
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If visiting the root without locale, determine best locale from priority:
  // 1. Saved user preference in cookie
  // 2. Country detection + Accept-Language
  // 3. Fallback to English
  if (!pathnameHasLocale && pathname === "/") {
    const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (savedLocale && routing.locales.includes(savedLocale as any)) {
      return NextResponse.redirect(new URL(`/${savedLocale}`, request.url));
    }

    // Country detection header (Cloudflare, Vercel, CloudFront)
    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("x-country-code") ||
      "";

    // Browser accept-language header
    const acceptLanguage = request.headers.get("accept-language") || "";

    let targetLocale = "en";

    // Specific rule for Morocco: if browser prefers French, give French; else Arabic
    if (country === "MA") {
      targetLocale = acceptLanguage.toLowerCase().includes("fr") ? "fr" : "ar";
    } else if (country && COUNTRY_LOCALE_MAP[country.toUpperCase()]) {
      targetLocale = COUNTRY_LOCALE_MAP[country.toUpperCase()];
    } else {
      // Find first supported language in accept-language
      const preferred = routing.locales.find((loc) =>
        acceptLanguage.toLowerCase().includes(loc.toLowerCase())
      );
      if (preferred) {
        targetLocale = preferred;
      }
    }

    const response = NextResponse.redirect(new URL(`/${targetLocale}`, request.url));
    response.cookies.set("NEXT_LOCALE", targetLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(ar|fr|en|es|zh-Hans|ja|de|ru)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
