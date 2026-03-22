import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins/admin"
import { twoFactor } from "better-auth/plugins/two-factor"
import { passkey } from "@better-auth/passkey"
import { render } from "@react-email/components"

import { db } from "@/lib/drizzle"
import { env } from "@/lib/Env"
import { schema } from "@/db/schema"
import { VerifyEmail, ResetPassword } from "@/emails"
import { logger } from "@/lib/logger"

async function sendAuthEmail(props: {
  action: "reset-password" | "verify-email"
  email: string
  url: string
  userName?: string
}) {
  if (env.RESEND_API_KEY) {
    const { Resend } = await import("resend")
    const resend = new Resend(env.RESEND_API_KEY)

    const emailContent =
      props.action === "reset-password"
        ? {
            subject: "Reset your password",
            html: await render(
              ResetPassword({ resetUrl: props.url, userName: props.userName })
            ),
          }
        : {
            subject: "Verify your email",
            html: await render(
              VerifyEmail({ verifyUrl: props.url, userName: props.userName })
            ),
          }

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: props.email,
        subject: emailContent.subject,
        html: emailContent.html,
      })
      logger.info("Auth email sent", {
        action: props.action,
        email: props.email,
      })
    } catch (error) {
      logger.error("Failed to send auth email", {
        action: props.action,
        email: props.email,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  } else {
    logger.warning("Email not configured - dev mode fallback", {
      action: props.action,
      email: props.email,
      url: props.url,
    })
  }
}

export const auth = betterAuth({
  appName: "SaaS",
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    sendResetPassword: async (data) => {
      await sendAuthEmail({
        action: "reset-password",
        email: data.user.email,
        url: data.url,
        userName: data.user.name,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async (data) => {
      await sendAuthEmail({
        action: "verify-email",
        email: data.user.email,
        url: data.url,
        userName: data.user.name,
      })
    },
  },
  socialProviders: {
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: env.NODE_ENV === "production",
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: [env.BETTER_AUTH_URL, env.NEXT_PUBLIC_APP_URL].filter(
    (value): value is string => Boolean(value)
  ),
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
  },
  experimental: {
    joins: false,
  },
  plugins: [admin(), twoFactor(), passkey(), nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = Session["user"]
