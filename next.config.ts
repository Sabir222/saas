import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Import env for build-time validation
import "@/lib/Env"

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts")

const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
