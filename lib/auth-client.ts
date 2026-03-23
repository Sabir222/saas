import { createAuthClient } from "better-auth/react"
import { adminClient, twoFactorClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"

const baseURL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`
  : "/api/auth"

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    adminClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        const locale = window.location.pathname.split("/")[1] || "en"
        window.location.href = `/${locale}/2fa`
      },
    }),
    passkeyClient(),
  ],
})
