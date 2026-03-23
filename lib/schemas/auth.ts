import { z } from "zod"
import { useTranslations } from "next-intl"

// Static schemas (for server-side validation and type inference)
export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type SignInInput = z.infer<typeof signInSchema>

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// Translatable schema hooks — use these in client components for i18n support
export function useSignInSchema() {
  const t = useTranslations("validation")

  return z.object({
    email: z.email(t("invalidEmail")),
    password: z.string().min(1, t("passwordRequired")),
  })
}

export function useSignUpSchema() {
  const t = useTranslations("validation")

  return z
    .object({
      name: z
        .string()
        .min(1, t("nameRequired"))
        .min(2, t("nameMinLength"))
        .max(100, t("nameMaxLength")),
      email: z.email(t("invalidEmail")),
      password: z
        .string()
        .min(1, t("passwordRequired"))
        .min(8, t("passwordMinLength"))
        .max(128, t("passwordMaxLength")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    })
}

export function useForgotPasswordSchema() {
  const t = useTranslations("validation")

  return z.object({
    email: z.email(t("invalidEmail")),
  })
}

export function useResetPasswordSchema() {
  const t = useTranslations("validation")

  return z
    .object({
      password: z
        .string()
        .min(1, t("passwordRequired"))
        .min(8, t("passwordMinLength"))
        .max(128, t("passwordMaxLength")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    })
}

export function useChangePasswordSchema() {
  const t = useTranslations("validation")

  return z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      newPassword: z
        .string()
        .min(1, t("newPasswordRequired"))
        .min(8, t("passwordMinLength"))
        .max(128, t("passwordMaxLength")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: t("newPasswordDifferent"),
      path: ["newPassword"],
    })
}
