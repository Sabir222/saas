import { describe, it, expect } from "vitest"
import { z } from "zod"
import { parseFormErrors } from "@/lib/parse-form-errors"

describe("parseFormErrors", () => {
  const schema = z.object({
    email: z.string().email("invalidEmail"),
    password: z.string().min(1, "passwordRequired").min(8, "passwordMinLength"),
  })

  it("returns success with data on valid input", () => {
    const result = parseFormErrors(schema, {
      email: "user@example.com",
      password: "securepass",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        email: "user@example.com",
        password: "securepass",
      })
    }
  })

  it("returns errors on invalid input", () => {
    const result = parseFormErrors(schema, {
      email: "bad",
      password: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors.email).toBeDefined()
      expect(result.errors.password).toBeDefined()
    }
  })

  it("returns field-level error for single field failure", () => {
    const result = parseFormErrors(schema, {
      email: "user@example.com",
      password: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(Object.keys(result.errors)).toEqual(["password"])
      expect(result.errors.password).toBeDefined()
    }
  })

  it("returns multiple field errors", () => {
    const result = parseFormErrors(schema, {
      email: "",
      password: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(Object.keys(result.errors).length).toBe(2)
    }
  })

  it("handles empty object", () => {
    const result = parseFormErrors(schema, {})
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(Object.keys(result.errors).length).toBeGreaterThan(0)
    }
  })

  it("handles null input", () => {
    const result = parseFormErrors(schema, null)
    expect(result.success).toBe(false)
  })
})
