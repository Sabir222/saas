---
title: Next.js integration
description: Integrate Better Auth with Next.js.
---

Better Auth can be easily integrated with Next.js. Before you start, make sure you have a Better Auth instance configured. If you haven't done that yet, check out the [installation](/docs/installation).

### Create API Route

We need to mount the handler to an API route. Create a route file inside `/api/auth/[...all]` directory. And add the following code:

```ts title="api/auth/[...all]/route.ts"
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

<Callout type="info">
 You can change the path on your better-auth configuration but it's recommended to keep it as `/api/auth/[...all]`
</Callout>

For `pages` route, you need to use `toNodeHandler` instead of `toNextJsHandler` and set `bodyParser` to `false` in the `config` object. Here is an example:

```ts title="pages/api/auth/[...all].ts"
import { toNodeHandler } from "better-auth/node"
import { auth } from "@/lib/auth"

// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } }

export default toNodeHandler(auth.handler)
```

## Create a client

Create a client instance. You can name the file anything you want. Here we are creating `auth-client.ts` file inside the `lib/` directory.

```ts title="auth-client.ts"
import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react

export const authClient = createAuthClient({
  //you can pass client configuration here
})
```

Once you have created the client, you can use it to sign up, sign in, and perform other actions.
Some of the actions are reactive. The client uses [nano-store](https://github.com/nanostores/nanostores) to store the state and re-render the components when the state changes.

The client also uses [better-fetch](https://github.com/bekacru/better-fetch) to make the requests. You can pass the fetch configuration to the client.

## RSC and Server actions

The `api` object exported from the auth instance contains all the actions that you can perform on the server. Every endpoint made inside Better Auth is a invocable as a function. Including plugins endpoints.

**Example: Getting Session on a server action**

```tsx title="server.ts"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const someAuthenticatedAction = async () => {
  "use server"
  const session = await auth.api.getSession({
    headers: await headers(),
  })
}
```

**Example: Getting Session on a RSC**

```tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return <div>Not authenticated</div>
  }
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
    </div>
  )
}
```

<Callout type="warn">As RSCs cannot set cookies, the [cookie cache](/docs/concepts/session-management#cookie-cache) will not be refreshed until the server is interacted with from the client via Server Actions or Route Handlers.</Callout>

### Server Action Cookies

When you call a function that needs to set cookies, like `signInEmail` or `signUpEmail` in a server action, cookies won’t be set. This is because server actions need to use the `cookies` helper from Next.js to set cookies.

To simplify this, you can use the `nextCookies` plugin, which will automatically set cookies for you whenever a `Set-Cookie` header is present in the response.

```ts title="auth.ts"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  //...your config
  plugins: [nextCookies()], // make sure this is the last plugin in the array // [!code highlight]
})
```

Now, when you call functions that set cookies, they will be automatically set.

```ts
"use server"
import { auth } from "@/lib/auth"

const signIn = async () => {
  await auth.api.signInEmail({
    body: {
      email: "user@email.com",
      password: "password",
    },
  })
}
```

## Auth Protection

In Next.js proxy/middleware, it's recommended to only check for the existence of a session cookie to handle redirection to avoid blocking requests by making API or database calls.

### Next.js 16+ (Proxy)

Next.js 16 replaces "middleware" with "proxy". You can use the Node.js runtime for full session validation with database checks:

```ts title="proxy.ts"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard"], // Specify the routes the middleware applies to
}
```

For cookie-only checks (faster but less secure), use `getSessionCookie`:

```ts title="proxy.ts"
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard"], // Specify the routes the middleware applies to
}
```

<Callout type="info">
**Migration from middleware:** Rename `middleware.ts` → `proxy.ts` and `middleware` → `proxy` function. All Better Auth methods work identically.
</Callout>

### Next.js 15.2.0+ (Node.js Runtime Middleware)

From Next.js 15.2.0, you can use the Node.js runtime in middleware for full session validation with database checks:

```ts title="middleware.ts"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: ["/dashboard"], // Specify the routes the middleware applies to
}
```

<Callout type="warn">
Node.js runtime in middleware is experimental in Next.js versions before 16. Consider upgrading to Next.js 16+ for stable proxy support.
</Callout>

### Next.js 13-15.1.x (Edge Runtime Middleware)

In older Next.js versions, middleware runs on the Edge Runtime and cannot make database calls. Use cookie-based checks for optimistic redirects:

<Callout type="warn">
The <code>getSessionCookie()</code> function does not automatically reference the auth config specified in <code>auth.ts</code>. Therefore, if you customized the cookie name or prefix, you need to ensure that the configuration in <code>getSessionCookie()</code> matches the config defined in your <code>auth.ts</code>.
</Callout>

#### For Next.js release `15.1.7` and below

If you need the full session object, you'll have to fetch it from the `/api/auth/get-session` API route. Since Next.js middleware doesn't support running Node.js APIs directly, you must make an HTTP request.

<Callout>
  The example uses [better-fetch](https://better-fetch.vercel.app), but you can use any fetch library.
</Callout>

```ts title="middleware.ts"
import { betterFetch } from "@better-fetch/fetch"
import type { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

type Session = typeof auth.$Infer.Session

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  )

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard"], // Apply middleware to specific routes
}
```

#### For Next.js release `15.2.0` and above

From Next.js 15.2.0, you can use the Node.js runtime in middleware for full session validation with database checks:

<Callout type="warn">
  You may refer to the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime) for more information about runtime configuration, and how to enable it.
  Be careful when using the new runtime. It's an experimental feature and it may be subject to breaking changes.
</Callout>

```ts title="middleware.ts"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard"], // Apply middleware to specific routes
}
```

#### Cookie-based checks (recommended for all versions)

```ts title="middleware.ts"
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard"], // Specify the routes the middleware applies to
}
```

<Callout type="warn">
	**Security Warning:** The `getSessionCookie` function only checks for the
	existence of a session cookie; it does **not** validate it. Relying solely
	on this check for security is dangerous, as anyone can manually create a
	cookie to bypass it. You must always validate the session on your server for
	any protected actions or pages.
</Callout>

<Callout type="info">
If you have a custom cookie name or prefix, you can pass it to the `getSessionCookie` function.
```ts
const sessionCookie = getSessionCookie(request, {
    cookieName: "my_session_cookie",
    cookiePrefix: "my_prefix"
});
```
</Callout>

Alternatively, you can use the `getCookieCache` helper to get the session object from the cookie cache.

```ts title="middleware.ts"
import { getCookieCache } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const session = await getCookieCache(request)
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
  return NextResponse.next()
}
```

### How to handle auth checks in each page/route

In this example, we are using the `auth.api.getSession` function within a server component to get the session object,
then we are checking if the session is valid. If it's not, we are redirecting the user to the sign-in page.

```tsx title="app/dashboard/page.tsx"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return <h1>Welcome {session.user.name}</h1>
}
```

## Next.js 16 Compatibility

Better Auth is fully compatible with Next.js 16. The main change is that "middleware" is now called "proxy". See the [Auth Protection](#auth-protection) section above for Next.js 16+ proxy examples.

### Migration Guide

Use Next.js codemod for automatic migration:

```bash
npx @next/codemod@canary middleware-to-proxy .
```

Or manually:

- Rename `middleware.ts` → `proxy.ts`
- Change function name: `middleware` → `proxy`

# Drizzle

---

title: Drizzle ORM Adapter
description: Integrate Better Auth with Drizzle ORM.

---

Drizzle ORM is a powerful and flexible ORM for Node.js and TypeScript. It provides a simple and intuitive API for working with databases, and supports a wide range of databases including MySQL, PostgreSQL, SQLite, and more.

Before getting started, make sure you have Drizzle installed and configured. For more information, see [Drizzle Documentation](https://orm.drizzle.team/docs/overview/)

## Installation

To use the Drizzle adapter, you need to install the `@better-auth/drizzle-adapter` package:

```package-install
@better-auth/drizzle-adapter
```

## Example Usage

You can use the Drizzle adapter to connect to your database as follows.

```ts title="auth.ts"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./database.ts"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    // [!code highlight]
    provider: "sqlite", // or "pg" or "mysql" // [!code highlight]
  }), // [!code highlight]
  //... the rest of your config
})
```

## Schema generation & migration

The [Better Auth CLI](/docs/concepts/cli) allows you to generate or migrate
your database schema based on your Better Auth configuration and plugins.

To generate the schema required by Better Auth, run the following command:

```package-install
npx auth@latest generate
```

To generate and apply the migration, run the following commands:

<Tabs items={["generate", "migrate"]}>
<Tab value="generate">
`package-install
      npx drizzle-kit generate # generate the migration file
      `
</Tab>
<Tab value="migrate">
`package-install
      npx drizzle-kit migrate # apply the migration
      `
</Tab>
</Tabs>

## Joins (Experimental)

Database joins is useful when Better-Auth needs to fetch related data from multiple tables in a single query.
Endpoints like `/get-session`, `/get-full-organization` and many others benefit greatly from this feature,
seeing upwards of 2x to 3x performance improvements depending on database latency.

The Drizzle adapter supports joins out of the box since version `1.4.0`.
To enable this feature, you need to set the `experimental.joins` option to `true` in your auth configuration.

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  experimental: { joins: true },
})
```

<Callout type="warn">
  Please make sure that your Drizzle schema has the necessary relations defined.
  If you do not see any relations in your Drizzle schema, you can manually add them using the [`relation`](https://orm.drizzle.team/docs/relations) drizzle-orm function
  or run our latest CLI version `npx auth@latest generate` to generate a new Drizzle schema with the relations.

Additionally, you're required to pass each [relation](https://orm.drizzle.team/docs/relations) through the drizzle adapter schema object.
</Callout>

## Modifying Table Names

The Drizzle adapter expects the schema you define to match the table names. For example, if your Drizzle schema maps the `user` table to `users`, you need to manually pass the schema and map it to the user table.

```ts
import { betterAuth } from "better-auth"
import { db } from "./drizzle"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { schema } from "./schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "pg" or "mysql"
    schema: {
      // [!code highlight]
      ...schema, // [!code highlight]
      user: schema.users, // [!code highlight]
    }, // [!code highlight]
  }),
})
```

You can either modify the provided schema values like the example above,
or you can mutate the auth config's `modelName` property directly.
For example:

```ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "pg" or "mysql"
    schema,
  }),
  user: {
    modelName: "users", // [!code highlight]
  },
})
```

## Modifying Field Names

We map field names based on property you passed to your Drizzle schema.
For example, if you want to modify the `email` field to `email_address`,
you simply need to change the Drizzle schema to:

```ts
export const user = mysqlTable("user", {
  // Changed field name without changing the schema property name
  // This allows drizzle & better-auth to still use the original field name,
  // while your DB uses the modified field name
  email: varchar("email_address", { length: 255 }).notNull().unique(), // [!code highlight]
  // ... others
})
```

You can either modify the Drizzle schema like the example above,
or you can mutate the auth config's `fields` property directly.
For example:

```ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "pg" or "mysql"
    schema,
  }),
  user: {
    fields: {
      email: "email_address", // [!code highlight]
    },
  },
})
```

## Using Plural Table Names

If all your tables are using plural form, you can just pass the `usePlural` option:

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    ...
    usePlural: true, // [!code highlight]
  }),
});
```

## Additional Information

- If you're looking for performance improvements or tips, take a look at our guide to <Link href="/docs/guides/optimizing-for-performance">performance optimizations</Link>.

# PostgreSQL

---

title: PostgreSQL
description: Integrate Better Auth with PostgreSQL.

---

PostgreSQL is a powerful, open-source relational database management system known for its advanced features, extensibility, and support for complex queries and large datasets.
Read more [here](https://www.postgresql.org/).

## Example Usage

Make sure you have PostgreSQL installed and configured.
Then, you can connect it straight into Better Auth.

```ts title="auth.ts"
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: "postgres://user:password@localhost:5432/database",
  }),
})
```

<Callout>
  For more information, read Kysely's documentation to the
  [PostgresDialect](https://kysely-org.github.io/kysely-apidoc/classes/PostgresDialect.html).
</Callout>

## Schema generation & migration

The [Better Auth CLI](/docs/concepts/cli) allows you to generate or migrate
your database schema based on your Better Auth configuration and plugins.

<table>
  <thead>
    <tr className="border-b">
      <th>
        <p className="font-bold text-[16px] mb-1">PostgreSQL Schema Generation</p>
      </th>
      <th>
        <p className="font-bold text-[16px] mb-1">PostgreSQL Schema Migration</p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="h-10">
      <td>&#9989; Supported</td>
      <td>&#9989; Supported</td>
    </tr>
  </tbody>
</table>

<Tabs items={["migrate", "generate"]}>
<Tab value="migrate">
`package-install
      npx auth@latest migrate
      `
</Tab>
<Tab value="generate">
`package-install
      npx auth@latest generate
      `
</Tab>
</Tabs>

## Joins (Experimental)

Database joins is useful when Better-Auth needs to fetch related data from multiple tables in a single query.
Endpoints like `/get-session`, `/get-full-organization` and many others benefit greatly from this feature,
seeing upwards of 2x to 3x performance improvements depending on database latency.

The Kysely PostgreSQL dialect supports joins out of the box since version `1.4.0`.
To enable this feature, you need to set the `experimental.joins` option to `true` in your auth configuration.

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  experimental: { joins: true },
})
```

<Callout type="warn">
  It's possible that you may need to run migrations after enabling this feature.
</Callout>

## Use a non-default schema

In most cases, the default schema is `public`. To have Better Auth use a
non-default schema (e.g., `auth`) for its tables, you have several options:

### Option 1: Set search_path in connection string (Recommended)

Append the `options` parameter to your connection URI:

```ts title="auth.ts"
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString:
      "postgres://user:password@localhost:5432/database?options=-c search_path=auth",
  }),
})
```

URL-encode if needed: `?options=-c%20search_path%3Dauth`.

### Option 2: Set search_path using Pool options

```ts title="auth.ts"
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "my-db",
    options: "-c search_path=auth",
  }),
})
```

### Option 3: Set default schema for database user

Set the PostgreSQL user's default schema:

```sql
ALTER USER your_user SET search_path TO auth;
```

After setting this, reconnect to apply the changes.

### Prerequisites

Before using a non-default schema, ensure:

1. **The schema exists:**

   ```sql
   CREATE SCHEMA IF NOT EXISTS auth;
   ```

2. **The user has appropriate permissions:**
   ```sql
   GRANT ALL PRIVILEGES ON SCHEMA auth TO your_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO your_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO your_user;
   ```

### How it works

The Better Auth CLI migration system automatically detects your configured `search_path`:

- When running `npx auth migrate`, it inspects only the tables in your configured schema
- Tables in other schemas (e.g., `public`) are ignored, preventing conflicts
- All new tables are created in your specified schema

### Troubleshooting

<Callout type="warning">
**Issue:** "relation does not exist" error during migration

**Solution:** This usually means the schema doesn't exist or the user lacks permissions. Create the schema and grant permissions as shown above.
</Callout>

<Callout type="info">
**Verifying your schema configuration:**

You can verify which schema Better Auth will use by checking the `search_path`:

```sql
SHOW search_path;
```

This should return your custom schema (e.g., `auth`) as the first value.
</Callout>

## Additional Information

PostgreSQL is supported under the hood via the [Kysely](https://kysely.dev/) adapter, any database supported by Kysely would also be supported. (<Link href="/docs/adapters/other-relational-databases">Read more here</Link>)

If you're looking for performance improvements or tips, take a look at our guide to <Link href="/docs/guides/optimizing-for-performance">performance optimizations</Link>.
