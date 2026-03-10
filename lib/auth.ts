import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins/admin"
import { twoFactor } from "better-auth/plugins/two-factor"
import { passkey } from "@better-auth/passkey"

import { db } from "@/lib/drizzle"
import { env } from "@/lib/Env"
import { schema } from "@/db/schema"

async function sendAuthEmail(props: {
  action: "reset-password" | "verify-email"
  email: string
  url: string
}) {
  if (env.RESEND_API_KEY) {
    const { Resend } = await import("resend")
    const resend = new Resend(env.RESEND_API_KEY)

    const emailContent =
      props.action === "reset-password"
        ? {
            subject: "Reset your password",
            html: `
              <h1>Reset Your Password</h1>
              <p>Click the link below to reset your password:</p>
              <a href="${props.url}">${props.url}</a>
              <p>This link will expire in 1 hour.</p>
            `,
          }
        : {
            subject: "Verify your email",
            html: `
              <h1>Verify Your Email</h1>
              <p>Click the link below to verify your email:</p>
              <a href="${props.url}">${props.url}</a>
            `,
          }

    try {
      await resend.emails.send({
        from: "SaaS <noreply@resend.dev>",
        to: props.email,
        subject: emailContent.subject,
        html: emailContent.html,
      })
      console.info(`[email] ${props.action} email sent to ${props.email}`)
    } catch (error) {
      console.error(`[email] Failed to send ${props.action} email:`, error)
    }
  } else {
    console.info(
      `[better-auth:${props.action}] Email sending is not configured yet for ${props.email}. Open this URL manually during development: ${props.url}`
    )
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
    requireEmailVerification: true,
    sendResetPassword: async (data) => {
      await sendAuthEmail({
        action: "reset-password",
        email: data.user.email,
        url: data.url,
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
      enabled: true,
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
    joins: true,
  },
  plugins: [admin(), twoFactor(), passkey(), nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = Session["user"]
