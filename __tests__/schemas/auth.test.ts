import { describe, it, expect } from "vitest"
import {
  createSignInSchema,
  createSignUpSchema,
  createForgotPasswordSchema,
  createResetPasswordSchema,
  createChangePasswordSchema,
} from "@/lib/schemas/auth"

import type { useTranslations } from "next-intl"

type T = ReturnType<typeof useTranslations>
const t = ((key: string) => key) as unknown as T

describe("createSignInSchema", () => {
  const schema = createSignInSchema(t)

  it("accepts valid email and password", () => {
    const result = schema.safeParse({
      email: "user@example.com",
      password: "securepass123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects empty email", () => {
    const result = schema.safeParse({ email: "", password: "pass123" })
    expect(result.success).toBe(false)
    if (!result.success) {
      const field = result.error.issues[0]?.path[0]
      expect(field).toBe("email")
    }
  })

  it("rejects invalid email format", () => {
    const result = schema.safeParse({ email: "not-an-email", password: "pass" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("email")
    }
  })

  it("rejects empty password", () => {
    const result = schema.safeParse({ email: "user@example.com", password: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("password")
      expect(result.error.issues[0]?.message).toBe("passwordRequired")
    }
  })
})

describe("createSignUpSchema", () => {
  const schema = createSignUpSchema(t)

  it("accepts valid sign-up data", () => {
    const result = schema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "securepass123",
      confirmPassword: "securepass123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects name shorter than 2 characters", () => {
    const result = schema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "securepass123",
      confirmPassword: "securepass123",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("name")
      expect(result.error.issues[0]?.message).toBe("nameMinLength")
    }
  })

  it("rejects name longer than 100 characters", () => {
    const result = schema.safeParse({
      name: "A".repeat(101),
      email: "john@example.com",
      password: "securepass123",
      confirmPassword: "securepass123",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("name")
      expect(result.error.issues[0]?.message).toBe("nameMaxLength")
    }
  })

  it("rejects empty name", () => {
    const result = schema.safeParse({
      name: "",
      email: "john@example.com",
      password: "securepass123",
      confirmPassword: "securepass123",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("name")
      expect(result.error.issues[0]?.message).toBe("nameRequired")
    }
  })

  it("rejects password shorter than 8 characters", () => {
    const result = schema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "short",
      confirmPassword: "short",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("password")
      expect(result.error.issues[0]?.message).toBe("passwordMinLength")
    }
  })

  it("rejects password longer than 128 characters", () => {
    const result = schema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "A".repeat(129),
      confirmPassword: "A".repeat(129),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("password")
      expect(result.error.issues[0]?.message).toBe("passwordMaxLength")
    }
  })

  it("rejects mismatched passwords", () => {
    const result = schema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "securepass123",
      confirmPassword: "differentpass",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("confirmPassword")
      expect(result.error.issues[0]?.message).toBe("passwordsDoNotMatch")
    }
  })

  it("rejects invalid email", () => {
    const result = schema.safeParse({
      name: "John Doe",
      email: "bad-email",
      password: "securepass123",
      confirmPassword: "securepass123",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("email")
    }
  })
})

describe("createForgotPasswordSchema", () => {
  const schema = createForgotPasswordSchema(t)

  it("accepts valid email", () => {
    const result = schema.safeParse({ email: "user@example.com" })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = schema.safeParse({ email: "not-an-email" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("email")
    }
  })
})

describe("createResetPasswordSchema", () => {
  const schema = createResetPasswordSchema(t)

  it("accepts valid password and confirm", () => {
    const result = schema.safeParse({
      password: "newsecurepass",
      confirmPassword: "newsecurepass",
    })
    expect(result.success).toBe(true)
  })

  it("rejects password shorter than 8 characters", () => {
    const result = schema.safeParse({
      password: "short",
      confirmPassword: "short",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("password")
      expect(result.error.issues[0]?.message).toBe("passwordMinLength")
    }
  })

  it("rejects password longer than 128 characters", () => {
    const long = "A".repeat(129)
    const result = schema.safeParse({ password: long, confirmPassword: long })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("password")
      expect(result.error.issues[0]?.message).toBe("passwordMaxLength")
    }
  })

  it("rejects mismatched passwords", () => {
    const result = schema.safeParse({
      password: "newsecurepass",
      confirmPassword: "different",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("confirmPassword")
      expect(result.error.issues[0]?.message).toBe("passwordsDoNotMatch")
    }
  })
})

describe("createChangePasswordSchema", () => {
  const schema = createChangePasswordSchema(t)

  it("accepts valid change password data", () => {
    const result = schema.safeParse({
      currentPassword: "oldpassword123",
      newPassword: "newpassword456",
      confirmPassword: "newpassword456",
    })
    expect(result.success).toBe(true)
  })

  it("rejects empty current password", () => {
    const result = schema.safeParse({
      currentPassword: "",
      newPassword: "newpassword456",
      confirmPassword: "newpassword456",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("currentPassword")
      expect(result.error.issues[0]?.message).toBe("currentPasswordRequired")
    }
  })

  it("rejects new password shorter than 8 characters", () => {
    const result = schema.safeParse({
      currentPassword: "oldpassword123",
      newPassword: "short",
      confirmPassword: "short",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("newPassword")
      expect(result.error.issues[0]?.message).toBe("passwordMinLength")
    }
  })

  it("rejects new password longer than 128 characters", () => {
    const long = "A".repeat(129)
    const result = schema.safeParse({
      currentPassword: "oldpassword123",
      newPassword: long,
      confirmPassword: long,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("newPassword")
      expect(result.error.issues[0]?.message).toBe("passwordMaxLength")
    }
  })

  it("rejects mismatched confirm password", () => {
    const result = schema.safeParse({
      currentPassword: "oldpassword123",
      newPassword: "newpassword456",
      confirmPassword: "mismatched",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("confirmPassword")
      expect(result.error.issues[0]?.message).toBe("passwordsDoNotMatch")
    }
  })

  it("rejects when new password equals current password", () => {
    const result = schema.safeParse({
      currentPassword: "samepassword123",
      newPassword: "samepassword123",
      confirmPassword: "samepassword123",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("newPassword")
      expect(result.error.issues[0]?.message).toBe("newPasswordDifferent")
    }
  })
})
