import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  const authRoutes = ["/sign-in", "/sign-up"]
  const isAuthRoute = authRoutes.includes(pathname)

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isAuthRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/account",
    "/account/:path*",
    "/admin/:path*",
  ],
}
