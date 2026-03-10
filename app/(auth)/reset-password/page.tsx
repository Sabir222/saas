"use client"

export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { ResetPasswordForm } from "./reset-password-form"

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
