import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Session } from "@/lib/auth"

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
    redirect("/dashboard")
  }

  return session
}

/**
 * Check if user is banned
 */
export async function isUserBanned(session: Session | null): Promise<boolean> {
  if (!session) return false

  // Check if user has banned field and it's true
  // The banned field should be on the user object
  const user = session.user as Session["user"] & { banned?: boolean }
  return user.banned === true
}
