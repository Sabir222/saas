"use client"

/**
 * Client-side logger for use in "use client" components.
 * Wraps console methods with consistent formatting.
 */
export const clientLogger = {
  debug: (message: string, data?: Record<string, unknown>) => {
    console.debug(`[saas] ${message}`, data ?? "")
  },
  info: (message: string, data?: Record<string, unknown>) => {
    console.info(`[saas] ${message}`, data ?? "")
  },
  warning: (message: string, data?: Record<string, unknown>) => {
    console.warn(`[saas] ${message}`, data ?? "")
  },
  error: (message: string, data?: Record<string, unknown>) => {
    console.error(`[saas] ${message}`, data ?? "")
  },
}
