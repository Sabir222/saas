import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins/admin"
import { twoFactor } from "better-auth/plugins/two-factor"
import { passkey } from "@better-auth/passkey"

import { db } from "@/lib/drizzle"
import { env } from "@/lib/Env"
import {
  schema,
  userRelations,
  sessionRelations,
  accountRelations,
  passkeyRelations,
  twoFactorRelations,
} from "@/db/schema"

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
    schema: {
      ...schema,
      user: {
        ...schema.user,
        relations: {
          sessions: userRelations,
          accounts: accountRelations,
          passkeys: passkeyRelations,
          twoFactors: twoFactorRelations,
        },
      },
      session: {
        ...schema.session,
        relations: {
          user: sessionRelations,
        },
      },
      account: {
        ...schema.account,
        relations: {
          user: accountRelations,
        },
      },
      passkey: {
        ...schema.passkey,
        relations: {
          user: passkeyRelations,
        },
      },
      twoFactor: {
        ...schema.twoFactor,
        relations: {
          user: twoFactorRelations,
        },
      },
    },
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
