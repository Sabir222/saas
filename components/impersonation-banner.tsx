"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { AlertTriangle, LogOut, Loader2 } from "lucide-react"

export function ImpersonationBanner() {
  const t = useTranslations()
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const [isStopping, setIsStopping] = useState(false)
  const { data: session } = authClient.useSession()

  const impersonatedBy = (session?.session as Record<string, unknown>)
    ?.impersonatedBy as string | undefined

  if (!impersonatedBy) return null

  async function handleStop() {
    setIsStopping(true)
    try {
      await authClient.admin.stopImpersonating()
      router.push(`/${locale}/admin`)
    } catch (error) {
      console.error("Failed to stop impersonating:", error)
      setIsStopping(false)
    }
  }

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-4 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950 dark:bg-amber-600 dark:text-amber-50">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        {t("impersonation.impersonating")}{" "}
        <strong>{session?.user?.name || session?.user?.email}</strong>
      </span>
      <Button
        size="sm"
        variant="outline"
        onClick={handleStop}
        disabled={isStopping}
        className="h-7 border-amber-900/20 bg-amber-950/10 text-amber-950 hover:bg-amber-950/20 dark:border-amber-50/20 dark:bg-amber-50/10 dark:text-amber-50 dark:hover:bg-amber-50/20"
      >
        {isStopping ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <LogOut className="mr-1 h-3 w-3" />
        )}
        {t("impersonation.stopImpersonating")}
      </Button>
    </div>
  )
}
