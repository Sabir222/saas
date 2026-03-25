import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextResponse, type NextRequest } from "next/server"

// Track the mock before mocking
const mockGetSessionCookie = vi.fn()
const mockIntlMiddleware = vi.fn(() => NextResponse.next())

vi.mock("better-auth/cookies", () => ({
  getSessionCookie: (req: NextRequest) => mockGetSessionCookie(req),
}))

vi.mock("next-intl/middleware", () => ({
  default: () => mockIntlMiddleware,
}))

vi.mock("@/lib/routing", () => ({
  routing: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    localePrefix: "as-needed",
  },
}))

vi.mock("@/lib/logger", () => ({
  logger: { debug: vi.fn(), warning: vi.fn() },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function makeRequest(pathname: string, url?: string): NextRequest {
  const fullUrl = url ?? `http://localhost:3000${pathname}`
  return {
    nextUrl: new URL(fullUrl),
    pathname,
    url: fullUrl,
  } as unknown as NextRequest
}

async function importProxy() {
  return await import("@/proxy")
}

describe("proxy middleware", () => {
  describe("API routes", () => {
    it("bypasses /api routes", async () => {
      const { proxy } = await importProxy()
      const req = makeRequest("/api/auth/sign-in")

      const res = proxy(req)

      expect(res).toBeDefined()
      expect(mockGetSessionCookie).not.toHaveBeenCalled()
    })

    it("bypasses nested /api routes", async () => {
      const { proxy } = await importProxy()
      const req = makeRequest("/api/health")

      proxy(req)

      expect(mockGetSessionCookie).not.toHaveBeenCalled()
    })
  })

  describe("auth routes with session", () => {
    it("redirects authenticated user from /en/sign-in to /en/dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("session-token")
      const { proxy } = await importProxy()
      const req = makeRequest("/en/sign-in")

      const res = proxy(req)

      expect(res.status).toBe(307)
      expect(res.headers.get("location")).toContain("/en/dashboard")
    })

    it("redirects authenticated user from /fr/sign-up to /fr/dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("session-token")
      const { proxy } = await importProxy()
      const req = makeRequest("/fr/sign-up")

      const res = proxy(req)

      expect(res.status).toBe(307)
      expect(res.headers.get("location")).toContain("/fr/dashboard")
    })

    it("uses default locale when no locale prefix on auth route", async () => {
      mockGetSessionCookie.mockReturnValue("session-token")
      const { proxy } = await importProxy()
      const req = makeRequest("/sign-in", "http://localhost:3000/sign-in")

      const res = proxy(req)

      expect(res.status).toBe(307)
      expect(res.headers.get("location")).toContain("/en/dashboard")
    })
  })

  describe("auth routes without session", () => {
    it("delegates to intl middleware for /en/sign-in without session", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/en/sign-in")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })
  })

  describe("protected routes without session", () => {
    it("redirects unauthenticated user from /en/dashboard to /en/sign-in", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/en/dashboard")

      const res = proxy(req)

      expect(res.status).toBe(307)
      expect(res.headers.get("location")).toContain("/en/sign-in")
    })

    it("redirects unauthenticated user from /fr/account to /fr/sign-in", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/fr/account")

      const res = proxy(req)

      expect(res.status).toBe(307)
      expect(res.headers.get("location")).toContain("/fr/sign-in")
    })

    it("does not redirect when no locale prefix (delegates to intl)", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/dashboard", "http://localhost:3000/dashboard")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })
  })

  describe("protected routes with session", () => {
    it("delegates to intl middleware for authenticated user on protected route", async () => {
      mockGetSessionCookie.mockReturnValue("session-token")
      const { proxy } = await importProxy()
      const req = makeRequest("/en/dashboard")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })
  })

  describe("public routes", () => {
    it("delegates to intl middleware for / without session", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/", "http://localhost:3000/")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })

    it("delegates to intl middleware for /en/forgot-password without session", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/en/forgot-password")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })

    it("delegates to intl middleware for /en/reset-password without session", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/en/reset-password")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })

    it("delegates to intl middleware for /en/verify-email without session", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/en/verify-email")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })

    it("delegates to intl middleware for /en/2fa without session", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/en/2fa")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })

    it("delegates to intl middleware for /en/verification-sent without session", async () => {
      mockGetSessionCookie.mockReturnValue(null)
      const { proxy } = await importProxy()
      const req = makeRequest("/en/verification-sent")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalledWith(req)
    })
  })

  describe("locale extraction", () => {
    it("extracts locale from /en/dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("token")
      const { proxy } = await importProxy()
      const req = makeRequest("/en/dashboard")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalled()
    })

    it("extracts locale from /fr/admin/users", async () => {
      mockGetSessionCookie.mockReturnValue("token")
      const { proxy } = await importProxy()
      const req = makeRequest("/fr/admin/users")

      proxy(req)

      expect(mockIntlMiddleware).toHaveBeenCalled()
    })
  })
})
