import { auth } from "@/lib/auth"
import { headers } from "next/headers"

type User = {
  id: string
  email: string
  name: string
  emailVerified: boolean
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * User Data Access Layer
 * Provides methods for custom user operations using the Better Auth API
 */
export class UserDAL {
  /**
   * Get a user by ID
   */
  async getById(userId: string) {
    return await auth.api.getUser({
      query: { id: userId },
      headers: await headers(),
    })
  }

  /**
   * Get list of users (admin only)
   */
  async list(limit = 10, offset = 0) {
    return await auth.api.listUsers({
      query: {
        limit,
        offset,
      },
      headers: await headers(),
    })
  }

  /**
   * Update a user (admin)
   */
  async updateUser(userId: string, data: Partial<User>) {
    return await auth.api.adminUpdateUser({
      body: {
        userId,
        data,
      },
      headers: await headers(),
    })
  }

  /**
   * Ban a user (admin)
   */
  async banUser(userId: string, banReason?: string, banExpiresIn?: number) {
    return await auth.api.banUser({
      body: {
        userId,
        banReason,
        banExpiresIn,
      },
      headers: await headers(),
    })
  }

  /**
   * Unban a user (admin)
   */
  async unbanUser(userId: string) {
    return await auth.api.unbanUser({
      body: { userId },
      headers: await headers(),
    })
  }

  /**
   * Set user role (admin)
   */
  async setRole(userId: string, role: "user" | "admin" | ("user" | "admin")[]) {
    return await auth.api.setRole({
      body: { userId, role },
      headers: await headers(),
    })
  }

  /**
   * Impersonate a user (admin)
   */
  async impersonate(userId: string) {
    return await auth.api.impersonateUser({
      body: { userId },
      headers: await headers(),
    })
  }

  /**
   * End impersonation session (admin)
   */
  async endImpersonation() {
    return await auth.api.stopImpersonating({
      headers: await headers(),
    })
  }
}

export const userDAL = new UserDAL()
