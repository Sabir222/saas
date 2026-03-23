import { z } from "zod"
import { useTranslations } from "next-intl"

// Type exports for form inputs
export type SignInInput = { email: string; password: string }
export type SignUpInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
}
export type ForgotPasswordInput = { email: string }
export type ResetPasswordInput = { password: string; confirmPassword: string }
export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Translatable schema hooks (use these for i18n support)
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
