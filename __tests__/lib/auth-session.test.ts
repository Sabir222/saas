import { describe, it, expect, vi, beforeEach } from "vitest"

const mockGetSession = vi.fn()
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))

import type { Session } from "@/lib/auth"

const mockRedirect = vi.fn((_dest?: string) => {
  throw new Error("NEXT_REDIRECT")
})
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(args[0] as string)
    throw new Error("NEXT_REDIRECT")
  },
}))

vi.mock("next/headers", () => ({
  headers: () => new Headers(),
}))

vi.mock("@/lib/logger", () => ({
  logger: { warning: vi.fn() },
}))

beforeEach(() => {
  vi.clearAllMocks()
  // Reset React.cache by re-importing module
})

async function importModule() {
  // Dynamic import to get fresh module (avoids cache across tests)
  return await import("@/lib/auth-session")
}

describe("session", () => {
  it("returns session when authenticated", async () => {
    const mockSession = {
      user: { id: "1", email: "test@test.com", role: "user" },
      session: { id: "s1" },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const { session } = await importModule()
    const result = await session()
    expect(result).toEqual(mockSession)
  })

  it("returns null when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null)

    const { session } = await importModule()
    const result = await session()
    expect(result).toBeNull()
  })
})

describe("requireAuth", () => {
  it("returns session when authenticated (no options)", async () => {
    const mockSession = {
      user: { id: "1", email: "test@test.com", role: "user" },
      session: { id: "s1" },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const { requireAuth } = await importModule()
    const result = await requireAuth()
    expect(result).toEqual(mockSession)
  })

  it("redirects to /sign-in when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null)

    const { requireAuth } = await importModule()

    await expect(requireAuth()).rejects.toThrow("NEXT_REDIRECT")
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in")
  })

  it("calls custom redirect when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null)

    const { requireAuth } = await importModule()
    const customRedirect = vi.fn(() => {
      throw new Error("CUSTOM_REDIRECT")
    }) as () => never

    await expect(requireAuth({ redirect: customRedirect })).rejects.toThrow(
      "CUSTOM_REDIRECT"
    )
    expect(customRedirect).toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it("returns session when role matches", async () => {
    const mockSession = {
      user: { id: "1", email: "admin@test.com", role: "admin" },
      session: { id: "s1" },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const { requireAuth } = await importModule()
    const result = await requireAuth({ role: "admin" })
    expect(result).toEqual(mockSession)
  })

  it("redirects to /dashboard when role doesn't match", async () => {
    const mockSession = {
      user: { id: "1", email: "user@test.com", role: "user" },
      session: { id: "s1" },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const { requireAuth } = await importModule()

    await expect(requireAuth({ role: "admin" })).rejects.toThrow(
      "NEXT_REDIRECT"
    )
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard")
  })

  it("calls custom redirect when role doesn't match", async () => {
    const mockSession = {
      user: { id: "1", email: "user@test.com", role: "user" },
      session: { id: "s1" },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const { requireAuth } = await importModule()
    const customRedirect = vi.fn(() => {
      throw new Error("CUSTOM_REDIRECT")
    }) as () => never

    await expect(
      requireAuth({ role: "admin", redirect: customRedirect })
    ).rejects.toThrow("CUSTOM_REDIRECT")
    expect(customRedirect).toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })
})

describe("requireSession", () => {
  it("returns session when authenticated", async () => {
    const mockSession = {
      user: { id: "1", email: "test@test.com", role: "user" },
      session: { id: "s1" },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const { requireSession } = await importModule()
    const result = await requireSession()
    expect(result).toEqual(mockSession)
  })

  it("redirects to /sign-in when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null)

    const { requireSession } = await importModule()

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT")
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in")
  })
})

describe("isAdmin", () => {
  it("returns true for admin role", async () => {
    const { isAdmin } = await importModule()
    const mockSession = {
      user: { id: "1", role: "admin" },
      session: { id: "s1" },
    }
    expect(isAdmin(mockSession as unknown as Session)).toBe(true)
  })

  it("returns false for user role", async () => {
    const { isAdmin } = await importModule()
    const mockSession = {
      user: { id: "1", role: "user" },
      session: { id: "s1" },
    }
    expect(isAdmin(mockSession as unknown as Session)).toBe(false)
  })

  it("returns false for null", async () => {
    const { isAdmin } = await importModule()
    expect(isAdmin(null)).toBe(false)
  })
})

describe("isBanned", () => {
  it("returns true for banned user", async () => {
    const { isBanned } = await importModule()
    const mockSession = {
      user: { id: "1", banned: true },
      session: { id: "s1" },
    }
    expect(isBanned(mockSession as unknown as Session)).toBe(true)
  })

  it("returns false for non-banned user", async () => {
    const { isBanned } = await importModule()
    const mockSession = {
      user: { id: "1", banned: false },
      session: { id: "s1" },
    }
    expect(isBanned(mockSession as unknown as Session)).toBe(false)
  })

  it("returns false for null", async () => {
    const { isBanned } = await importModule()
    expect(isBanned(null)).toBe(false)
  })
})
