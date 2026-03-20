# Better Auth Implementation Coverage Report

Generated: 2026-03-20
Project: `saas`
Scope: Full Better Auth feature audit against current codebase + official plugin index

---

## Current Better Auth Wiring

- **Server plugins enabled:** `admin()`, `twoFactor()`, `passkey()`, `nextCookies()` in `lib/auth.ts`
- **Client plugins enabled:** `adminClient()`, `twoFactorClient()`, `passkeyClient()` in `lib/auth-client.ts`
- **Core API handler:** `app/api/auth/[...all]/route.ts`

---

## Table 1 — Core Auth Features

| Feature                                | Code Implemented | UI Created | Finished | Notes                                                                                                           |
| -------------------------------------- | ---------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| Email sign up                          | Yes              | Yes        | Partial  | Works, but redirects to `/dashboard` even with `requireEmailVerification: true` (`app/(auth)/sign-up/page.tsx`) |
| Email sign in                          | Yes              | Yes        | Yes      | Email/password login implemented (`app/(auth)/sign-in/page.tsx`)                                                |
| Social sign in (GitHub)                | Yes              | Yes        | Yes\*    | Works if env vars are set (`lib/auth.ts`)                                                                       |
| Social sign in (Google)                | Yes              | Yes        | Yes\*    | Works if env vars are set (`lib/auth.ts`)                                                                       |
| Sign out                               | Yes              | Yes        | Yes      | Used in dashboard/admin/home                                                                                    |
| Session hook/useSession                | Yes              | Yes        | Yes      | Used across protected pages                                                                                     |
| Email verification send on signup      | Yes              | N/A        | Yes      | `emailVerification.sendOnSignUp` enabled                                                                        |
| Email verification page/token handling | Yes              | Yes        | Yes      | `app/(auth)/verify-email/verify-email-form.tsx`                                                                 |
| Forgot password request                | Yes              | Yes        | Yes      | Fixed: added `redirectTo` in `requestPasswordReset` (`app/(auth)/forgot-password/page.tsx`)                     |
| Reset password (token + new password)  | Yes              | Yes        | Yes      | Depends on forgot-password flow now working                                                                     |
| Change password                        | Yes              | Yes        | Yes      | In account page (`app/(dashboard)/account/page.tsx`)                                                            |
| Change email                           | No               | No         | No       | Not configured/enabled                                                                                          |
| Delete user account                    | No               | No         | No       | Not configured/enabled                                                                                          |
| Require email verification             | Yes              | N/A        | Yes      | `requireEmailVerification: true` in `lib/auth.ts`                                                               |
| Middleware auth route gating           | Yes              | N/A        | Yes      | `proxy.ts` matches `/sign-in`, `/sign-up`, `/dashboard`, `/account`, `/admin`                                   |

\* depends on OAuth env keys being configured.

---

## Table 2 — 2FA and Passkey Subfeatures

| Feature                                       | Code | UI  | Finished | Notes                                                   |
| --------------------------------------------- | ---- | --- | -------- | ------------------------------------------------------- |
| 2FA plugin enabled                            | Yes  | N/A | Yes      | `twoFactor()` in `lib/auth.ts`                          |
| 2FA redirect on sign-in                       | Yes  | N/A | Yes      | `onTwoFactorRedirect` to `/2fa` in `lib/auth-client.ts` |
| 2FA verification page (`/2fa`)                | Yes  | Yes | Yes      | Supports TOTP + backup code                             |
| 2FA enable flow                               | Yes  | Yes | Yes      | Password prompt + QR/TOTP URI + backup codes modal      |
| 2FA disable flow                              | Yes  | Yes | Yes      | Password-confirm disable                                |
| 2FA backup code verify                        | Yes  | Yes | Yes      | In `/2fa` page                                          |
| 2FA OTP via email/SMS (`sendOtp`/`verifyOtp`) | No   | No  | No       | Not implemented                                         |
| Passkey plugin enabled                        | Yes  | N/A | Yes      | `passkey()` in `lib/auth.ts`                            |
| Add/register passkey                          | Yes  | Yes | Yes      | Button wired to `authClient.passkey.addPasskey()`       |
| Sign in with passkey                          | No   | No  | No       | No passkey sign-in UI/flow                              |
| List passkeys                                 | No   | No  | No       | Not implemented                                         |
| Rename/delete passkey                         | No   | No  | No       | Not implemented                                         |

---

## Table 3 — Admin Plugin Subfeatures

| Feature                   | Code | UI  | Finished | Notes                                              |
| ------------------------- | ---- | --- | -------- | -------------------------------------------------- |
| Admin plugin enabled      | Yes  | N/A | Yes      | `admin()` in `lib/auth.ts`                         |
| Admin route guard         | Yes  | Yes | Yes      | Permission check in `app/(admin)/admin/layout.tsx` |
| List users                | Yes  | Yes | Yes      | `authClient.admin.listUsers()`                     |
| Ban/unban user            | Yes  | Yes | Yes      | In admin users actions                             |
| Impersonate user          | Yes  | Yes | Yes      | In admin users actions                             |
| Stop impersonation        | Yes  | No  | Partial  | DAL exists, no UI flow                             |
| Set role                  | Yes  | No  | Partial  | DAL exists, no UI flow                             |
| Admin session revoke/list | Yes  | No  | Partial  | DAL exists, no UI flow                             |

---

## Table 4 — Official Better Auth Plugin Coverage (Full)

Source: `https://better-auth.com/docs/plugins`

Legend: `Code/UI/Finished` = `Yes / Partial / No`

### Authentication

| Plugin                    | Code | UI      | Finished |
| ------------------------- | ---- | ------- | -------- |
| Two-Factor Authentication | Yes  | Yes     | Partial  |
| Passkey                   | Yes  | Partial | Partial  |
| Magic Link                | No   | No      | No       |
| Email OTP                 | No   | No      | No       |
| Phone Number              | No   | No      | No       |
| Anonymous                 | No   | No      | No       |
| Username                  | No   | No      | No       |
| One Tap                   | No   | No      | No       |
| Sign In With Ethereum     | No   | No      | No       |
| Generic OAuth plugin      | No   | No      | No       |
| Multi Session             | No   | No      | No       |
| Last Login Method         | No   | No      | No       |

### Authorization & Management

| Plugin       | Code | UI  | Finished |
| ------------ | ---- | --- | -------- |
| Admin        | Yes  | Yes | Partial  |
| Organization | No   | No  | No       |
| SSO          | No   | No  | No       |
| SCIM         | No   | No  | No       |

### API & Tokens

| Plugin         | Code | UI  | Finished |
| -------------- | ---- | --- | -------- |
| API Key        | No   | No  | No       |
| JWT            | No   | No  | No       |
| Bearer         | No   | No  | No       |
| One-Time Token | No   | No  | No       |
| OAuth Proxy    | No   | No  | No       |

### OAuth & OIDC Providers

| Plugin               | Code | UI  | Finished |
| -------------------- | ---- | --- | -------- |
| OAuth 2.1 Provider   | No   | No  | No       |
| OIDC Provider        | No   | No  | No       |
| MCP                  | No   | No  | No       |
| Device Authorization | No   | No  | No       |

### Payments & Billing

| Plugin         | Code | UI  | Finished |
| -------------- | ---- | --- | -------- |
| Stripe         | No   | No  | No       |
| Polar          | No   | No  | No       |
| Autumn Billing | No   | No  | No       |
| Creem          | No   | No  | No       |
| Commet         | No   | No  | No       |
| Dodo Payments  | No   | No  | No       |

### Security & Utilities

| Plugin            | Code | UI  | Finished |
| ----------------- | ---- | --- | -------- |
| Captcha           | No   | No  | No       |
| Have I Been Pwned | No   | No  | No       |
| i18n              | No   | No  | No       |
| Open API          | No   | No  | No       |
| Test Utils        | No   | No  | No       |

### Analytics & Tracking

| Plugin | Code | UI  | Finished |
| ------ | ---- | --- | -------- |
| Dub    | No   | No  | No       |

---

## Key Analysis

1. **Your current implementation is a selected subset, not full Better Auth.**
   - You implemented a strong base: email/password, email verification, OAuth, 2FA, passkey registration, and admin.
   - Most official plugins are intentionally not integrated.

2. **Forgot-password flow is now fixed.**
   - Added `redirectTo: "/reset-password"` to `requestPasswordReset` so reset links land on the correct form page.

3. **2FA flow is now mostly complete.**
   - Sign-in redirect + `/2fa` verification + enrollment modal + backup codes are implemented.
   - OTP-based 2FA mode (`sendOtp`, `verifyOtp`) is still not implemented.

4. **Passkey implementation is partial.**
   - Add/register is implemented.
   - Sign-in with passkey and passkey lifecycle management (list, rename, delete) are missing.

5. **Admin operations are partially surfaced in UI.**
   - Core admin user controls are present.
   - Advanced admin operations exist in DAL but are not exposed in UI.

---

## High-Priority Next Steps

1. Fix forgot-password flow by adding `redirectTo: "/reset-password"` in `app/(auth)/forgot-password/page.tsx`.
2. Add passkey sign-in flow (`authClient.signIn.passkey`) on sign-in page.
3. Add passkey management UI: list + delete + rename.
4. Decide whether OTP-based 2FA (email/SMS) is needed; if yes, implement `otpOptions.sendOTP` + UI.
5. Optionally enable account self-service features: change email and delete account.
