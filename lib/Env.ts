import { env as validatedEnv, type Env } from "./env-schema"

export const env = validatedEnv
export type { Env }

type EnvKey =
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  | "NEXT_PUBLIC_APP_URL"
  | "NODE_ENV"
  | "POSTGRES_URL"
  | "GITHUB_CLIENT_ID"
  | "GITHUB_CLIENT_SECRET"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "RESEND_API_KEY"

export type { EnvKey }

export function getOptionalEnv(key: EnvKey) {
  return validatedEnv[key]
}
