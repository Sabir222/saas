import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import createMiddleware from "next-intl/middleware"
import { routing } from "./lib/routing"
import { logger } from "@/lib/logger"

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Extract locale from path (first segment after /)
  const segments = pathname.split("/").filter(Boolean)
  const locale = routing.locales.includes(
    segments[0] as (typeof routing.locales)[number]
  )
    ? segments[0]
    : null
  const pathWithoutLocale = locale
    ? "/" + segments.slice(1).join("/") || "/"
    : pathname

  // Auth route checks (must happen before intl middleware)
  const sessionCookie = getSessionCookie(request)

  const authRoutes = ["/sign-in", "/sign-up"]
  const isAuthRoute = authRoutes.includes(pathWithoutLocale)

  if (isAuthRoute && sessionCookie) {
    const effectiveLocale = locale || routing.defaultLocale
    logger.debug(
      "Authenticated user accessing auth route, redirecting to dashboard",
      {
        path: pathname,
        locale: effectiveLocale,
      }
    )
    return NextResponse.redirect(
      new URL(`/${effectiveLocale}/dashboard`, request.url)
    )
  }

  // Protected routes
  const publicRoutes = [
    "/",
    "/forgot-password",
    "/reset-password",
    "/verification-sent",
    "/verify-email",
    "/2fa",
  ]
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale)

  if (!isPublicRoute && !isAuthRoute && !sessionCookie && locale) {
    logger.warning("Unauthenticated user accessing protected route", {
      path: pathname,
      locale,
    })
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url))
  }

  // Delegate to next-intl middleware for locale negotiation,
  // cookie persistence, alternateLinks, and request headers
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
}
