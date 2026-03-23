# I18n Implementation Analysis — [next-intl](file:///home/sabir/Projects/saas/node_modules/next-intl) v4 (App Router)

Thorough review against the [official next-intl documentation](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) for production/SaaS readiness.

---

## Verdict Summary

| Area | Status | Severity |
|---|---|---|
| Routing config ([routing.ts](file:///home/sabir/Projects/saas/lib/routing.ts)) | ✅ Correct | — |
| Request config ([i18n.ts](file:///home/sabir/Projects/saas/lib/i18n.ts)) | ⚠️ Minor issue | Medium |
| Next.js plugin ([next.config.ts](file:///home/sabir/Projects/saas/next.config.ts)) | ✅ Correct | — |
| Proxy / Middleware ([proxy.ts](file:///home/sabir/Projects/saas/proxy.ts)) | ❌ Not using `next-intl/middleware` | **Critical** |
| Navigation APIs | ❌ Missing `createNavigation` | **Critical** |
| `generateStaticParams` | ❌ Missing | High |
| `setRequestLocale` coverage | ⚠️ Incomplete | High |
| Locale layout validation | ⚠️ Missing [hasLocale](file:///home/sabir/Projects/saas/proxy.ts#23-28) + `notFound()` | High |
| `<html lang>` attribute | ❌ Missing | High |
| `not-found.tsx` | ❌ Missing | Medium |
| Message files structure | ✅ Correct and complete | — |
| `useTranslations` / `getTranslations` usage | ✅ Mostly correct | — |
| Zod schema i18n | ⚠️ Partial — duplicated static schemas | Medium |
| Translation completeness (en ↔ fr) | ✅ 1:1 key parity | — |

---

## Critical Issues

### 1. ❌ Proxy does not use `next-intl/middleware`

**File:** [proxy.ts](file:///home/sabir/Projects/saas/proxy.ts)

Your proxy has a custom hand-rolled locale detection/redirect implementation. The official docs **require** using `createMiddleware` from `next-intl/middleware`:

```ts
// Official pattern — proxy.ts (or middleware.ts for Next.js < 16)
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

> [!CAUTION]
> Without `next-intl/middleware`, the `x-next-intl-locale` header is never set. This means `getRequestConfig` receives the locale via a less reliable mechanism, `setRequestLocale` may not work correctly, and you lose:
> - Automatic `Accept-Language` negotiation
> - Cookie-based locale persistence (`NEXT_LOCALE`)
> - Automatic locale prefix handling (redirect, rewrite, prefix strategies)
> - Proper `alternateLinks` in responses for SEO

**Your custom proxy** duplicates locale detection logic and hardcodes `["en", "fr"]` separately from [routing.ts](file:///home/sabir/Projects/saas/lib/routing.ts), creating a maintenance risk.

**Fix:** Replace the custom locale-handling code in [proxy.ts](file:///home/sabir/Projects/saas/proxy.ts) with `createMiddleware(routing)`. You can still compose it with your auth checks — the docs show a [composing middleware pattern](https://next-intl.dev/docs/routing/middleware#composing-with-other-middleware).

---

### 2. ❌ Missing `createNavigation` — All navigation is raw Next.js

**Missing file:** `lib/navigation.ts` (should exist)

The official docs require creating locale-aware navigation wrappers with `createNavigation`:

```ts
// lib/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

**Currently, every file** uses `next/link` and `next/navigation` directly, then manually constructs URLs with `` `/${locale}/...` ``:

```tsx
// ❌ What you're doing now (navbar.tsx, sign-in/page.tsx, etc.)
import Link from "next/link"
import { useRouter } from "next/navigation"

<Link href={`/${locale}/dashboard`}>
router.push(`/${locale}/dashboard`)
```

```tsx
// ✅ What the docs require
import {Link, useRouter} from '@/lib/navigation'

<Link href="/dashboard">        // locale is handled automatically
router.push("/dashboard")       // locale is handled automatically
```

> [!IMPORTANT]
> **14 files** currently use `next/link` and **12 use** `useRouter`/`usePathname` from `next/navigation`. All need to be migrated to the `createNavigation` wrappers.

The language switcher in [navbar.tsx](file:///home/sabir/Projects/saas/components/navbar.tsx) uses a brittle regex to swap locales:
```tsx
// ❌ Fragile
pathname.replace(/^\/[a-z]{2}/, "/en")

// ✅ With createNavigation, use usePathname + Link
<Link href={pathname} locale="en">   // automatic locale switching
```

---

## High-Severity Issues

### 3. ❌ Missing `generateStaticParams`

**File:** [app/\[locale\]/layout.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/layout.tsx)

The docs state this is **required** for the `[locale]` dynamic segment to enable static rendering:

```ts
import {routing} from '@/lib/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
```

Without this, all pages under `[locale]` are forced into dynamic rendering, which is a significant performance hit for a SaaS product.

---

### 4. ⚠️ Missing [hasLocale](file:///home/sabir/Projects/saas/proxy.ts#23-28) + `notFound()` validation in layout

**File:** [app/\[locale\]/layout.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/layout.tsx)

Your layout does not validate the locale or call `notFound()`. The official pattern is:

```tsx
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/lib/routing';

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();    // ← you're missing this
  }
  setRequestLocale(locale);
  // ...
}
```

Currently, if someone visits `/xyz/dashboard`, they'd get an unexpected fallback to English instead of a proper 404. This is a security and UX concern for a production SaaS.

---

### 5. ❌ `<html lang>` attribute is missing

**File:** [app/layout.tsx](file:///home/sabir/Projects/saas/app/layout.tsx)

The root `<html>` tag has no `lang` attribute. This is critical for:
- **Accessibility** (screen readers)
- **SEO** (Google uses it for language identification)

The `lang` attribute should be set dynamically based on the locale. Since the root layout is above `[locale]`, you need to either:
1. Move the `<html>` tag into [app/[locale]/layout.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/layout.tsx), or
2. Pass the locale from `[locale]/layout.tsx` up to the root layout

---

### 6. ⚠️ `setRequestLocale` only called in one layout

`setRequestLocale(locale)` is only called in [app/[locale]/layout.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/layout.tsx). Per the docs:

> You need to call this function in **every page and every layout** that you intend to enable static rendering for.

Missing in:
- [app/[locale]/(dashboard)/layout.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/%28dashboard%29/layout.tsx)
- [app/[locale]/(admin)/admin/layout.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/%28admin%29/admin/layout.tsx)
- [app/[locale]/page.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/page.tsx) (server component)
- All other server component pages

---

### 7. ⚠️ `redirect("/dashboard")` is missing locale prefix

**File:** [app/\[locale\]/(admin)/admin/layout.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/%28admin%29/admin/layout.tsx#L16)

```tsx
redirect("/dashboard")   // ❌ Missing locale — goes to /dashboard instead of /en/dashboard
```

With `createNavigation`'s `redirect`, the locale would be added automatically.

---

## Medium-Severity Issues

### 8. ⚠️ [i18n.ts](file:///home/sabir/Projects/saas/lib/i18n.ts) uses custom validation instead of [hasLocale](file:///home/sabir/Projects/saas/proxy.ts#23-28)

**File:** [lib/i18n.ts](file:///home/sabir/Projects/saas/lib/i18n.ts)

```ts
// ❌ Your current approach
if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {

// ✅ Official pattern
import {hasLocale} from 'next-intl';
const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
```

[hasLocale](file:///home/sabir/Projects/saas/proxy.ts#23-28) is the official utility that provides proper type narrowing.

---

### 9. ⚠️ Zod schemas have duplicated hardcoded English strings

**File:** [lib/schemas/auth.ts](file:///home/sabir/Projects/saas/lib/schemas/auth.ts)

You have both static schemas (lines 5–54) with hardcoded English error messages AND the translatable [useChangePasswordSchema](file:///home/sabir/Projects/saas/lib/schemas/auth.ts#77-100) hook (lines 78–99). But the sign-in page still uses the static `signInSchema`:

```tsx
// sign-in/page.tsx
const result = signInSchema.safeParse({ email, password })   // ❌ English-only validation
```

For a SaaS app, all user-facing validation errors should be translated. Create `useSignInSchema`, `useSignUpSchema`, etc. hooks, similar to the existing [useChangePasswordSchema](file:///home/sabir/Projects/saas/lib/schemas/auth.ts#77-100).

---

### 10. ⚠️ Locale config is duplicated

[proxy.ts](file:///home/sabir/Projects/saas/proxy.ts) line 6:
```ts
const locales = ["en", "fr"] as const    // ❌ duplicated from routing.ts
```

Should import from [routing.ts](file:///home/sabir/Projects/saas/lib/routing.ts) to have a single source of truth (this becomes automatic when using `createMiddleware(routing)`).

---

### 11. ❌ Missing `not-found.tsx`

No `app/[locale]/not-found.tsx` exists. When `notFound()` is called (e.g., invalid locale), Next.js will show the default 404, which won't be translated. Add a locale-aware `not-found.tsx`.

---

## What You Did Right ✅

1. **[routing.ts](file:///home/sabir/Projects/saas/lib/routing.ts)** — Correct use of `defineRouting` with proper locale list and default
2. **[next.config.ts](file:///home/sabir/Projects/saas/next.config.ts)** — Correct use of `createNextIntlPlugin` pointing to [i18n.ts](file:///home/sabir/Projects/saas/lib/i18n.ts)
3. **Message files** — Both [en.json](file:///home/sabir/Projects/saas/messages/en.json) and [fr.json](file:///home/sabir/Projects/saas/messages/fr.json) have perfect 1:1 key parity with 272 lines each, well-organized namespace hierarchy
4. **`NextIntlClientProvider`** — Correctly set up in locale layout with `getMessages()`
5. **`useTranslations` usage** — Consistent namespace-based usage across all 17+ components
6. **`getTranslations` in server components** — Correctly used in server pages like [page.tsx](file:///home/sabir/Projects/saas/app/%5Blocale%5D/page.tsx)
7. **[useChangePasswordSchema](file:///home/sabir/Projects/saas/lib/schemas/auth.ts#77-100)** — Good pattern for i18n Zod validation, just needs to be applied to all schemas

---

## Priority Fix Order

| Priority | Fix | Effort |
|---|---|---|
| 1 | Create `lib/navigation.ts` with `createNavigation` | Small |
| 2 | Replace [proxy.ts](file:///home/sabir/Projects/saas/proxy.ts) locale logic with `createMiddleware(routing)` (compose with auth) | Medium |
| 3 | Add `generateStaticParams` to layout | Small |
| 4 | Add [hasLocale](file:///home/sabir/Projects/saas/proxy.ts#23-28) + `notFound()` validation in locale layout | Small |
| 5 | Add `lang` attribute to `<html>` tag | Small |
| 6 | Migrate all `next/link` & `next/navigation` imports to `@/lib/navigation` | Medium |
| 7 | Add `setRequestLocale` to all server layouts/pages | Small |
| 8 | Fix `redirect("/dashboard")` → `redirect("/dashboard")` using next-intl's `redirect` | Small |
| 9 | Create i18n Zod hooks for all schemas, remove static duplicates | Medium |
| 10 | Add `app/[locale]/not-found.tsx` | Small |
