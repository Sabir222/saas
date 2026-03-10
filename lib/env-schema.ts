import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  POSTGRES_URL: z.string().min(1, "POSTGRES_URL is required"),

  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌ Invalid environment variables:")
  parsed.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`)
  })
  process.exit(1)
}

export const env = parsed.data
export type Env = z.infer<typeof envSchema>
