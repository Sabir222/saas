"use client"

export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { VerifyEmailForm } from "./verify-email-form"

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailForm />
    </Suspense>
  )
}
