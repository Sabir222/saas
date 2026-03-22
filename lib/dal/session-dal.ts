import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"

/**
 * Session Data Access Layer
 * Provides methods for custom session operations using the Better Auth API
 */
export class SessionDAL {
  /**
   * List sessions for a user (admin)
   */
  async listByUserId(userId: string) {
    logger.debug("Listing sessions for user", { userId })
    return await auth.api.listUserSessions({
      body: { userId },
      headers: await headers(),
    })
  }

  /**
   * Revoke a session (admin)
   */
  async revoke(sessionToken: string) {
    logger.info("Revoking session", {
      sessionToken: sessionToken.slice(0, 8) + "...",
    })
    return await auth.api.revokeUserSession({
      body: { sessionToken },
      headers: await headers(),
    })
  }

  /**
   * Revoke all sessions for a user (admin)
   */
  async revokeAll(userId: string) {
    logger.warning("Revoking all sessions for user", { userId })
    return await auth.api.revokeUserSessions({
      body: { userId },
      headers: await headers(),
    })
  }

  /**
   * Get current session
   */
  async getCurrent() {
    return await auth.api.getSession({
      headers: await headers(),
    })
  }
}

export const sessionDAL = new SessionDAL()
