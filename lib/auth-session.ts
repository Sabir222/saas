import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Session } from "@/lib/auth"
import { logger } from "@/lib/logger"

/**
 * Get the current session from the server
 */
export async function getSession(): Promise<Session | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

/**
 * Require a session - redirects to sign-in if not authenticated
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) {
    logger.warning("Unauthenticated access attempt, redirecting to sign-in")
    redirect("/sign-in")
  }
  return session
}

/**
 * Get session or redirect to a specific page
 */
export async function getSessionOrRedirect(
  redirectTo: string = "/sign-in"
): Promise<Session> {
  const session = await getSession()
  if (!session) {
    logger.warning("Unauthenticated access attempt", { redirectTo })
    redirect(redirectTo)
  }
  return session
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(session: Session | null): Promise<boolean> {
  if (!session) return false
  return session.user.role === "admin"
}

/**
 * Require admin role - redirects to dashboard if not an admin
 */
export async function requireAdmin(): Promise<Session> {
  const session = await requireSession()

  if (session.user.role !== "admin") {
    logger.warning("Non-admin user attempted admin access", {
      userId: session.user.id,
      role: session.user.role,
    })
    redirect("/dashboard")
  }

  return session
}

/**
 * Check if user is banned
 */
export async function isUserBanned(session: Session | null): Promise<boolean> {
  if (!session) return false

  const user = session.user as Session["user"] & { banned?: boolean }
  if (user.banned === true) {
    logger.warning("Banned user detected", { userId: session.user.id })
  }
  return user.banned === true
}
