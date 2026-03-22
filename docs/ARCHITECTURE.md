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
