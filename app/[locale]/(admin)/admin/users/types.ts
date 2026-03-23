export type UserWithRole = {
  id: string
  email: string
  name: string | null
  image: string | null | undefined
  createdAt: Date
  emailVerified: boolean
  banned: boolean
  role: string | null | undefined
}

export type SessionInfo = {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  expiresAt: Date
}
