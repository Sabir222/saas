import { env as t3Env, type Env, type EnvKey } from "./env-schema"

// Re-export from t3-env for backward compatibility
export const env = t3Env
export type { Env, EnvKey }

// Keep helper function for optional env access
export function getOptionalEnv(key: string): string | undefined {
  return process.env[key]
}
