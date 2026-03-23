import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"

export const runtime = "nodejs"

// Only export methods that better-auth actually uses
export const { GET, POST } = toNextJsHandler(auth)
