import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { routing } from "./lib/routing"

const handleI18nRouting = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth routes — redirect authenticated users to dashboard
  const sessionCookie = getSessionCookie(request)
  const authRoutes = ["/sign-in", "/sign-up"]

  if (authRoutes.some((route) => pathname.endsWith(route)) && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Let next-intl handle locale routing
  const response = handleI18nRouting(request)

  // Protected routes — redirect unauthenticated users to sign-in
  if (response.status === 200 && !sessionCookie) {
    const publicRoutes = [
      "/",
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/reset-password",
      "/verification-sent",
      "/verify-email",
      "/2fa",
    ]

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/")

    if (!publicRoutes.includes(pathWithoutLocale)) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
