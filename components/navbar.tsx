"use client"

import { useTranslations } from "next-intl"
import {
  Home,
  LayoutDashboard,
  LogOut,
  User,
  Shield,
  Globe,
  Check,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import type { Session } from "@/lib/auth"
import { Link, usePathname, useRouter } from "@/lib/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ImpersonationBanner } from "@/components/impersonation-banner"

export function Navbar({ session }: { session: Session | null }) {
  const t = useTranslations()
  const pathname = usePathname()
  const user = session?.user
  const router = useRouter()

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

  return (
    <>
      <ImpersonationBanner session={session} />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-4 w-4" />
            <span>{t("common.home")}</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("common.changeLanguage")}
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={pathname}
                    locale="en"
                    className="flex items-center justify-between"
                  >
                    English
                    {t("common.locale") === "en" && (
                      <Check className="h-4 w-4" />
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={pathname}
                    locale="fr"
                    className="flex items-center justify-between"
                  >
                    Français
                    {t("common.locale") === "fr" && (
                      <Check className="h-4 w-4" />
                    )}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t("navbar.dashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account")}>
                      <User className="mr-2 h-4 w-4" />
                      {t("navbar.account")}
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem onClick={() => router.push("/admin")}>
                        <Shield className="mr-2 h-4 w-4" />
                        {t("navbar.admin")}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("common.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    {t("common.signIn")}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">{t("common.signUp")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
