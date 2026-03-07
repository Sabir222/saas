type EnvKey =
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  | "NEXT_PUBLIC_APP_URL"
  | "NODE_ENV"
  | "POSTGRES_URL"

type NodeEnv = "development" | "test" | "production"

function readRequiredEnv(key: EnvKey) {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

function readOptionalEnv(key: EnvKey) {
  return process.env[key]
}

function readNodeEnv(): NodeEnv {
  const value = process.env.NODE_ENV

  if (value === "production" || value === "test") {
    return value
  }

  return "development"
}

export const env = {
  BETTER_AUTH_SECRET: readRequiredEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: readRequiredEnv("BETTER_AUTH_URL"),
  NEXT_PUBLIC_APP_URL: readOptionalEnv("NEXT_PUBLIC_APP_URL"),
  NODE_ENV: readNodeEnv(),
  POSTGRES_URL: readRequiredEnv("POSTGRES_URL"),
}

export function getOptionalEnv(key: EnvKey) {
  return readOptionalEnv(key)
}
