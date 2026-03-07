import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/lib/drizzle"
import { env } from "@/lib/Env"
import { schema } from "@/db/schema"

async function sendAuthEmail(props: {
  action: "reset-password" | "verify-email"
  email: string
  url: string
}) {
  console.info(
    `[better-auth:${props.action}] Email sending is not configured yet for ${props.email}. Open this URL manually during development: ${props.url}`
  )
}

export const auth = betterAuth({
  appName: "SaaS",
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
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
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = Session["user"]
