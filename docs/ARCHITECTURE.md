# Architecture

## Passing Data: Props (Not Context)

This project passes session data from server layouts to client components using **props**, not React Context or state management libraries like Zustand.

### Why Props?

**React docs on Context:**

> "Context is primarily used when some data needs to be accessible by **many components at different nesting levels**. Apply it sparingly because it makes component reuse more difficult."

**Our component tree:**

```
DashboardLayout (server)
└── AppSidebar (client) ← needs user data
    └── NavUser (client) ← needs user data
```

This is **not** prop drilling - it's passing data where it's needed (2-3 levels max).

### When Context _Would_ Make Sense

- 5+ levels of components that don't use the data
- Multiple unrelated branches needing the same data
- Global state updated from many places

Our session doesn't fit any of these - it flows in a clear hierarchy.

### Pattern

```tsx
// Server layout fetches session
export default async function Layout() {
  const session = await requireSession()
  return <AppSidebar user={session.user} />
}

// Client component receives as prop
;("use client")
export function AppSidebar({ user }) {
  return <NavUser user={user} />
}
```

### No Session Provider, No Zustand, No Abstractions

Just props. Simple, clear, and recommended by the React team.

## Auth Session: Deep Module with React.cache()

### Design Choice

Auth session access uses a **cached core + composable gates** pattern, implemented in `lib/auth-session.ts`.

**4 exports, 1 file:**

```ts
// Core — cached via React.cache(), one DB hit per request
session() → Promise<Session | null>

// Gates — delegate to core, redirect on failure
requireAuth({ role?, redirect? }) → Promise<Session>
requireSession() → Promise<Session>  // convenience wrapper

// Predicates — pure, no side effects
isAdmin(session) → boolean
isBanned(session) → boolean
```

### Why React.cache()?

Layouts and pages both need the session. Without caching:

- Dashboard: layout calls `requireSession()` + page calls `getSession()` = **2 DB queries**
- Admin: layout + page each call `requireSession()` + role check = **2 DB queries, 2 checks**

With `React.cache()`, `session()` is deduplicated across the RSC render tree. Layout fetches → page gets cached result. **1 DB query total.**

### Why Callback Redirect?

The auth module uses `redirect()` from `next/navigation` by default. But admin pages need `redirect()` from `@/lib/navigation` (i18n-aware). The `requireAuth()` function accepts an optional `redirect` callback:

```ts
// Dashboard — default redirect is fine
const s = await requireSession()

// Admin — i18n-aware redirect + role gate
const s = await requireAuth({
  role: "admin",
  redirect: () => redirect({ href: "/dashboard", locale }),
})
```

This keeps `lib/auth-session.ts` i18n-agnostic while letting callers control redirect behavior.

### Rule: One Session Fetch Per Request

- **Layouts** call `requireSession()` or `requireAuth()` to guard access
- **Pages** call `session()` (cached hit, zero cost) — never re-fetch
- **Never** call `auth.api.getSession()` directly — always go through `lib/auth-session.ts`
