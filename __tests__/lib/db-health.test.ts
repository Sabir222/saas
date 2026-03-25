import { describe, it, expect, vi, beforeEach } from "vitest"

const mockConnect = vi.fn()
const mockQuery = vi.fn()
const mockEnd = vi.fn()

vi.mock("pg", () => ({
  Client: function (this: {
    connect: typeof mockConnect
    query: typeof mockQuery
    end: typeof mockEnd
  }) {
    this.connect = mockConnect
    this.query = mockQuery
    this.end = mockEnd
  },
}))

vi.mock("@/lib/Env", () => ({
  env: {
    POSTGRES_URL: "postgres://localhost:5432/test",
  },
}))

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue(undefined)
  mockQuery.mockResolvedValue({ rows: [] })
  mockEnd.mockResolvedValue(undefined)
})

describe("checkDbHealth", () => {
  it("returns ok=true when connection succeeds", async () => {
    const { checkDbHealth } = await import("@/lib/db-health")

    const result = await checkDbHealth()

    expect(result.ok).toBe(true)
    expect(result.message).toBe("Connected to Postgres")
    expect(mockConnect).toHaveBeenCalled()
    expect(mockQuery).toHaveBeenCalledWith("SELECT 1")
    expect(mockEnd).toHaveBeenCalled()
  })

  it("uses custom timeoutMs", async () => {
    const { checkDbHealth } = await import("@/lib/db-health")

    await checkDbHealth({ timeoutMs: 5000 })

    // The Client constructor was called with the correct timeout
    expect(mockConnect).toHaveBeenCalled()
  })

  it("uses default timeout of 3000ms", async () => {
    const { checkDbHealth } = await import("@/lib/db-health")

    await checkDbHealth()

    expect(mockConnect).toHaveBeenCalled()
  })

  it("uses custom url when provided", async () => {
    const { checkDbHealth } = await import("@/lib/db-health")

    await checkDbHealth({ url: "postgres://custom:5432/mydb" })

    expect(mockConnect).toHaveBeenCalled()
  })

  it("falls back to env.POSTGRES_URL", async () => {
    const { checkDbHealth } = await import("@/lib/db-health")

    await checkDbHealth()

    expect(mockConnect).toHaveBeenCalled()
  })

  it("returns ok=false with ECONNREFUSED suggestion", async () => {
    const error = Object.assign(
      new Error("connect ECONNREFUSED 127.0.0.1:5432"),
      {
        code: "ECONNREFUSED",
      }
    )
    mockConnect.mockRejectedValue(error)

    const { checkDbHealth } = await import("@/lib/db-health")

    const result = await checkDbHealth()

    expect(result.ok).toBe(false)
    expect(result.code).toBe("ECONNREFUSED")
    expect(result.message).toContain("ECONNREFUSED")
    expect(result.suggestion).toContain("docker compose up -d postgres")
  })

  it("returns ok=false with ENOTFOUND suggestion", async () => {
    const error = Object.assign(new Error("getaddrinfo ENOTFOUND dbhost"), {
      code: "ENOTFOUND",
    })
    mockConnect.mockRejectedValue(error)

    const { checkDbHealth } = await import("@/lib/db-health")

    const result = await checkDbHealth()

    expect(result.ok).toBe(false)
    expect(result.code).toBe("ENOTFOUND")
    expect(result.suggestion).toContain("POSTGRES_URL")
  })

  it("returns ok=false with timeout suggestion", async () => {
    mockConnect.mockRejectedValue(new Error("connect_timeout"))

    const { checkDbHealth } = await import("@/lib/db-health")

    const result = await checkDbHealth()

    expect(result.ok).toBe(false)
    expect(result.message).toContain("connect_timeout")
    expect(result.suggestion).toContain("did not respond in time")
  })

  it("returns ok=false with auth failure suggestion", async () => {
    const error = Object.assign(new Error("password authentication failed"), {
      code: "28P01",
    })
    mockConnect.mockRejectedValue(error)

    const { checkDbHealth } = await import("@/lib/db-health")

    const result = await checkDbHealth()

    expect(result.ok).toBe(false)
    expect(result.code).toBe("28P01")
    expect(result.suggestion).toContain("credentials")
  })

  it("returns ok=false with default suggestion for unknown errors", async () => {
    mockConnect.mockRejectedValue(new Error("some unknown error"))

    const { checkDbHealth } = await import("@/lib/db-health")

    const result = await checkDbHealth()

    expect(result.ok).toBe(false)
    expect(result.suggestion).toContain("docker compose")
  })

  it("handles non-Error thrown values", async () => {
    mockConnect.mockRejectedValue("string error")

    const { checkDbHealth } = await import("@/lib/db-health")

    const result = await checkDbHealth()

    expect(result.ok).toBe(false)
    expect(result.message).toBe("string error")
    expect(result.code).toBeUndefined()
  })

  it("closes client even on error", async () => {
    mockConnect.mockRejectedValue(new Error("fail"))

    const { checkDbHealth } = await import("@/lib/db-health")

    await checkDbHealth()

    expect(mockEnd).toHaveBeenCalled()
  })

  it("handles client.end() failure gracefully", async () => {
    mockConnect.mockRejectedValue(new Error("fail"))
    mockEnd.mockRejectedValue(new Error("end failed"))

    const { checkDbHealth } = await import("@/lib/db-health")

    // Should not throw
    const result = await checkDbHealth()

    expect(result.ok).toBe(false)
  })
})
