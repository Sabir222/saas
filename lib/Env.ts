import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

/**
 * t3-env configuration for Next.js-aware environment variable validation
 * with client/server separation.
 * 
 * Server-only variables (never exposed to client):
 * - BETTER_AUTH_SECRET, BETTER_AUTH_URL, POSTGRES_URL
 * - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 * - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 * - RESEND_API_KEY
 * 
 * Client-safe variables (exposed via NEXT_PUBLIC_* prefix):
 * - NEXT_PUBLIC_APP_URL
 * 
 * Shared variables:
 * - NODE_ENV
 */
export const env = createEnv({
  /**
   * Server-only variables (never exposed to client)
   */
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    POSTGRES_URL: z.string().min(1),
    
    // OAuth providers
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    
    // Email provider
    RESEND_API_KEY: z.string().optional(),
  },
  
  /**
   * Client-safe variables (exposed to client via NEXT_PUBLIC_* prefix)
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  
  /**
   * Shared variables (available in both client and server)
   */
  shared: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  
  /**
   * Runtime environment variables to validate
   */
  runtimeEnv: {
    // Server-only
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    
    // Client (must have NEXT_PUBLIC_ prefix)
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    
    // Shared
    NODE_ENV: process.env.NODE_ENV,
  },
  
  /**
   * For empty strings, treat them as undefined
   */
  emptyStringAsUndefined: true,
  
  /**
   * Skip validation in certain contexts (e.g., linting)
   */
  skipValidation: process.env.npm_lifecycle_event === "lint",
})

export type Env = z.infer<typeof env>
export type EnvKey = keyof typeof env

// Helper function for optional env access
export function getOptionalEnv(key: string): string | undefined {
  return process.env[key]
}
