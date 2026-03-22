import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { logger } from "@/lib/logger"

const locales = ["en", "fr"] as const
const defaultLocale = "en"

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") ?? ""
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase())

  for (const lang of languages) {
    if (lang === "fr" || lang.startsWith("fr-")) return "fr"
    if (lang === "en" || lang.startsWith("en-")) return "en"
  }

  return defaultLocale
}

function hasLocaleInPath(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
}

function extractLocaleAndPath(pathname: string): {
  locale: string
  pathWithoutLocale: string
} {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return { locale, pathWithoutLocale: "/" }
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, pathWithoutLocale: pathname.slice(locale.length + 1) }
    }
  }
  return { locale: defaultLocale, pathWithoutLocale: pathname }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes and static files
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // If no locale in path, redirect to add locale
  if (!hasLocaleInPath(pathname)) {
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    logger.debug("Redirecting to locale-prefixed path", {
      from: pathname,
      to: request.nextUrl.pathname,
      locale,
    })
    return NextResponse.redirect(request.nextUrl)
  }

  // Extract locale and path for auth checks
  const { pathWithoutLocale } = extractLocaleAndPath(pathname)
  const sessionCookie = getSessionCookie(request)

  const authRoutes = ["/sign-in", "/sign-up"]
  const isAuthRoute = authRoutes.includes(pathWithoutLocale)

  if (isAuthRoute && sessionCookie) {
    const locale = pathname.split("/")[1]
    logger.debug(
      "Authenticated user accessing auth route, redirecting to dashboard",
      {
        path: pathname,
        locale,
      }
    )
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  // Protected routes (everything except auth routes, landing page, and public pages)
  const publicRoutes = [
    "/",
    "/forgot-password",
    "/reset-password",
    "/verification-sent",
    "/verify-email",
    "/2fa",
  ]
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale)

  if (!isPublicRoute && !isAuthRoute && !sessionCookie) {
    const locale = pathname.split("/")[1]
    logger.warning("Unauthenticated user accessing protected route", {
      path: pathname,
      locale,
    })
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
