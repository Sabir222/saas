import { cache } from "react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Session } from "@/lib/auth"
import { logger } from "@/lib/logger"

export type { Session } from "@/lib/auth"

/**
 * Core session fetch. Cached per-request via React.cache().
 * Layout + page both call this → one DB hit per request.
 * Returns null if unauthenticated.
 */
export const session = cache(async (): Promise<Session | null> => {
  return auth.api.getSession({ headers: await headers() })
})

/**
 * Require an authenticated session with optional role constraint.
 * Accepts a callback redirect for i18n compatibility.
 *
 * - No options → any authenticated user
 * - { role: "admin" } → authenticated + admin role
 * - { redirect: () => redirect({href,locale}) } → custom redirect (i18n)
 */
export async function requireAuth(opts?: {
  role?: string
  redirect?: () => never
}): Promise<Session> {
  const s = await session()

  if (!s) {
    logger.warning("Unauthenticated access attempt")
    if (opts?.redirect) {
      opts.redirect()
    } else {
      redirect("/sign-in")
    }
  }

  if (opts?.role && s!.user.role !== opts.role) {
    logger.warning("Unauthorized role access", {
      userId: s!.user.id,
      required: opts.role,
      actual: s!.user.role,
    })
    if (opts?.redirect) {
      opts.redirect()
    } else {
      redirect("/dashboard")
    }
  }

  return s!
}

/**
 * Convenience: require any authenticated session.
 * Uses default next/navigation redirect (no locale prefix).
 */
export async function requireSession(): Promise<Session> {
  return requireAuth()
}

/**
 * Pure predicate — check if session has admin role.
 */
export function isAdmin(s: Session | null): boolean {
  return s?.user.role === "admin"
}

/**
 * Pure predicate — check if user is banned.
 */
export function isBanned(s: Session | null): boolean {
  return Boolean((s?.user as Record<string, unknown>)?.banned)
}
